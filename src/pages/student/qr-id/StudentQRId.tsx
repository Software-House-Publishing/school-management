"use client"

import { useMemo } from "react"
import { Layers } from "lucide-react"

type StudentIdData = {
  university: string
  name: string
  studentId: string
  major: string
  year: string
  validUntil: string
  issued: string
}

function hashSeed(input: string) {
  // FNV-1a-ish
  let h = 2166136261 >>> 0
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  return h >>> 0
}

function makeRng(seed: number) {
  // xorshift32
  let s = seed >>> 0
  return () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return (s >>> 0) / 4294967296
  }
}

function inBounds(n: number, r: number, c: number) {
  return r >= 0 && c >= 0 && r < n && c < n
}

function paintFinder(matrix: number[][], top: number, left: number) {
  // 7x7 finder + 1px quiet-ish ring
  const n = matrix.length
  for (let r = -1; r <= 7; r++) {
    for (let c = -1; c <= 7; c++) {
      const rr = top + r
      const cc = left + c
      if (!inBounds(n, rr, cc)) continue

      const isBorder = r === -1 || c === -1 || r === 7 || c === 7
      const in7 = r >= 0 && c >= 0 && r <= 6 && c <= 6
      const isOuter = in7 && (r === 0 || c === 0 || r === 6 || c === 6)
      const isInner = in7 && (r >= 2 && r <= 4 && c >= 2 && c <= 4)

      if (isBorder) matrix[rr][cc] = 0
      else if (isOuter) matrix[rr][cc] = 2
      else if (isInner) matrix[rr][cc] = 2
      else matrix[rr][cc] = 0
    }
  }
}

function paintTiming(matrix: number[][]) {
  const n = matrix.length
  // row 6 and col 6 (QR-ish)
  for (let i = 8; i < n - 8; i++) {
    matrix[6][i] = i % 2 === 0 ? 2 : 0
    matrix[i][6] = i % 2 === 0 ? 2 : 0
  }
}

function buildPseudoQrMatrix(text: string, size = 29) {
  const seed = hashSeed(text)
  const rnd = makeRng(seed)

  // 0 = empty, 1 = light dot, 2 = strong dot
  const m: number[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => 0))

  // Finder patterns
  paintFinder(m, 1, 1)
  paintFinder(m, 1, size - 8)
  paintFinder(m, size - 8, 1)
  paintTiming(m)

  // Fill remaining with deterministic noise
  const reserved = (r: number, c: number) => {
    // reserve around finders and timing lines
    const inTopLeft = r <= 8 && c <= 8
    const inTopRight = r <= 8 && c >= size - 9
    const inBottomLeft = r >= size - 9 && c <= 8
    const inTiming = r === 6 || c === 6
    return inTopLeft || inTopRight || inBottomLeft || inTiming
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (reserved(r, c)) continue
      const p = rnd()
      if (p > 0.78) m[r][c] = 2
      else if (p > 0.62) m[r][c] = 1
      else m[r][c] = 0
    }
  }

  return m
}

function matrixToSvg(matrix: number[][], opts?: { cell?: number; padding?: number }) {
  const cell = opts?.cell ?? 10
  const padding = opts?.padding ?? 16
  const n = matrix.length
  const w = n * cell + padding * 2
  const h = n * cell + padding * 2

  const dots: string[] = []
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const v = matrix[r][c]
      if (!v) continue
      const cx = padding + c * cell + cell / 2
      const cy = padding + r * cell + cell / 2
      const rad = (cell * 0.36) * (v === 2 ? 1 : 0.75)
      const op = v === 2 ? 0.95 : 0.55
      dots.push(`<circle cx="${cx}" cy="${cy}" r="${rad}" fill="white" fill-opacity="${op}"/>`)
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0ea5a4"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${w}" height="${h}" rx="18" fill="url(#bg)"/>
  ${dots.join("\n  ")}
</svg>`
}

function downloadTextFile(filename: string, content: string, mime = "image/svg+xml") {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function PseudoQr({ value }: { value: string }) {
  const matrix = useMemo(() => buildPseudoQrMatrix(value, 29), [value])
  const n = matrix.length

  return (
    <div
      className="grid gap-[4px]"
      style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
      aria-label="QR code"
      role="img"
    >
      {matrix.flatMap((row, r) =>
        row.map((v, c) => {
          const isOn = v > 0
          const opacity = v === 2 ? "opacity-95" : v === 1 ? "opacity-60" : "opacity-0"
          return (
            <span
              key={`${r}-${c}`}
              className={[
                "aspect-square rounded-[999px] bg-white",
                isOn ? opacity : "opacity-0",
              ].join(" ")}
            />
          )
        })
      )}
    </div>
  )
}

export default function StudentQRId() {
  const data: StudentIdData = {
    university: "SCITECH UNIVERSITY",
    name: "Sarah Conner",
    studentId: "STU-2400001",
    major: "Computer Science",
    year: "2nd Year",
    validUntil: "December 2025",
    issued: "September 2023",
  }

  const matrix = useMemo(() => buildPseudoQrMatrix(data.studentId, 29), [data.studentId])

  const onPrint = () => window.print()

  const onDownloadQr = () => {
    const svg = matrixToSvg(matrix, { cell: 10, padding: 18 })
    downloadTextFile(`${data.studentId}-qr.svg`, svg)
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Virtual ID Card</h1>
        <p className="mt-2 text-gray-600">Your digital student ID for attendance and identification</p>
      </div>

      {/* Card */}
      <div className="print-area rounded-3xl bg-gradient-to-br from-blue-700 via-sky-600 to-emerald-700 p-8 text-white shadow-xl">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-sm font-semibold tracking-wide opacity-90">{data.university}</div>
            <div className="mt-2 text-3xl font-extrabold">Student ID Card</div>
          </div>

          <div className="flex items-center gap-2 opacity-90">
            <Layers className="h-7 w-7" />
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
          {/* Left details */}
          <div className="space-y-5">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider opacity-80">Name</div>
              <div className="mt-1 text-2xl font-extrabold">{data.name}</div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider opacity-80">Student ID</div>
              <div className="mt-1 text-xl font-bold">{data.studentId}</div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider opacity-80">Major</div>
              <div className="mt-1 text-xl font-bold">{data.major}</div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider opacity-80">Year</div>
              <div className="mt-1 text-xl font-bold">{data.year}</div>
            </div>
          </div>

          {/* Right QR */}
          <div className="flex md:justify-end">
            <div className="w-full max-w-[320px] rounded-2xl bg-white p-5 shadow-lg">
              <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-700 p-5">
                <PseudoQr value={data.studentId} />
              </div>
              <div className="mt-4 text-center text-sm font-semibold tracking-wide text-gray-900">
                {data.studentId}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 h-px w-full bg-white/25" />

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-sm opacity-80">Valid Until</div>
            <div className="text-lg font-bold">{data.validUntil}</div>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-sm opacity-80">Issued</div>
            <div className="text-lg font-bold">{data.issued}</div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="no-print mt-6 grid gap-4 sm:grid-cols-2">
        <button
          onClick={onPrint}
          className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-800"
        >
          Print Card
        </button>
        <button
          onClick={onDownloadQr}
          className="rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
        >
          Download QR Code
        </button>
      </div>

      {/* How-to */}
      <div className="no-print mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-6 shadow-sm">
        <div className="text-lg font-bold text-gray-900">How to Use Your Virtual ID</div>

        <ol className="mt-4 space-y-3 text-gray-700">
          <li className="flex gap-3">
            <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
              1
            </span>
            <span>Show this QR code to your teacher during class to mark attendance</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
              2
            </span>
            <span>Use your Student ID for library check-outs and campus access</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
              3
            </span>
            <span>Keep this ID card accessible on your phone or print it</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
              4
            </span>
            <span>Report lost or damaged IDs to the student office</span>
          </li>
        </ol>
      </div>
    </div>
  )
}
