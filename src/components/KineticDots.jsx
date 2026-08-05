"use client"

import React, { useRef, useEffect } from "react"

export default function KineticDots({
    mode,
    background,
    dotColor,
    spacing = 40,
    radius = 250,
    strength = 4,
    trail = false,
    style,
}) {
    const hostRef = useRef(null)
    const canvasRef = useRef(null)
    const mouseRef = useRef({ x: -9999, y: -9999, active: false })
    const trailRef = useRef([])
    const [isDark, setIsDark] = React.useState(
        () => document.body.classList.contains("dark-mode")
    )
    const [isJournalActive, setIsJournalActive] = React.useState(
        () => document.body.classList.contains("journal-active")
    )
    const [isFocusJournal, setIsFocusJournal] = React.useState(false)

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.body.classList.contains("dark-mode"))
            setIsJournalActive(document.body.classList.contains("journal-active"))
        })
        observer.observe(document.body, { attributes: true, attributeFilter: ["class"] })
        
        const splash = document.getElementById("splash-screen")
        let observer2 = null
        if (splash) {
            setIsFocusJournal(splash.classList.contains("focus-journal"))
            observer2 = new MutationObserver(() => {
                setIsFocusJournal(splash.classList.contains("focus-journal"))
            })
            observer2.observe(splash, { attributes: true, attributeFilter: ["class"] })
        }
        
        return () => {
            observer.disconnect()
            if (observer2) observer2.disconnect()
        }
    }, [])

    const activeMode = mode || (isDark ? "dark" : "light")
    const bg = background || (activeMode === "light" ? "#d1ccc5" : "#161311")
    const dot = dotColor || (activeMode === "light" ? "#1A1A1A" : "#EEEEEE")
    const trColor = activeMode === "light" ? "hsl(207, 79%, 28%)" : "hsl(207, 90%, 68%)"

    useEffect(() => {
        const host = hostRef.current
        const canvas = canvasRef.current
        if (!host || !canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const GAP = Math.max(8, spacing)
        const R = Math.max(1, radius)
        const PULL = (Math.max(1, Math.min(10, strength)) / 10) * 4

        let W = 1
        let H = 1
        let dots = []

        const build = (mw, mh) => {
            const r = host.getBoundingClientRect()
            W = Math.max(1, Math.floor(mw ?? r.width))
            H = Math.max(1, Math.floor(mh ?? r.height))
            const dpr = window.devicePixelRatio || 1
            canvas.width = Math.floor(W * dpr)
            canvas.height = Math.floor(H * dpr)
            canvas.style.width = W + "px"
            canvas.style.height = H + "px"
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

            dots = []
            const nCols = Math.floor(W / GAP) + 2
            const nRows = Math.floor(H / GAP) + 2
            for (let c = 0; c < nCols; c++) {
                for (let rIdx = 0; rIdx < nRows; rIdx++) {
                    const hx = c * GAP
                    const hy = rIdx * GAP
                    dots.push({ hx, hy, x: hx, y: hy, vx: 0, vy: 0 })
                }
            }
        }

        build()

        const ro =
            typeof ResizeObserver !== "undefined"
                ? new ResizeObserver((entries) => {
                      const cr = entries[0]?.contentRect
                      build(cr?.width, cr?.height)
                  })
                : null
        ro?.observe(host)

        const setMouse = (clientX, clientY) => {
            const r = canvas.getBoundingClientRect()
            const mx = clientX - r.left
            const my = clientY - r.top
            mouseRef.current.x = mx
            mouseRef.current.y = my
            mouseRef.current.active = true
            const now = performance.now()
            const tr = trailRef.current
            tr.push({ x: mx, y: my, t: now })
            if (tr.length > 80) tr.shift()
        }

        const onMove = (e) => setMouse(e.clientX, e.clientY)
        const onLeave = () => {
            mouseRef.current.active = false
            mouseRef.current.x = -9999
            mouseRef.current.y = -9999
        }
        const onTouch = (e) => {
            const t = e.touches[0]
            if (t) setMouse(t.clientX, t.clientY)
        }

        window.addEventListener("mousemove", onMove)
        host.addEventListener("mouseleave", onLeave)
        window.addEventListener("touchmove", onTouch, { passive: true })
        window.addEventListener("touchend", onLeave)

        let raf = 0
        const frame = () => {
            const m = mouseRef.current
            ctx.clearRect(0, 0, W, H)

            for (const d of dots) {
                let ax = (d.hx - d.x) * 0.08
                let ay = (d.hy - d.y) * 0.08
                if (m.active) {
                    const dx = m.x - d.x
                    const dy = m.y - d.y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < R && dist > 0.001) {
                        const f = (1 - dist / R) * PULL
                        ax += (dx / dist) * f
                        ay += (dy / dist) * f
                    }
                }
                d.vx = (d.vx + ax) * 0.82
                d.vy = (d.vy + ay) * 0.82
                d.x += d.vx
                d.y += d.vy
            }

            for (const d of dots) {
                const prox = m.active
                    ? Math.max(
                          0,
                          1 - Math.sqrt((m.x - d.x) ** 2 + (m.y - d.y) ** 2) / R
                      )
                    : 0
                ctx.globalAlpha = 0.2 + prox * 0.8
                ctx.fillStyle = dot
                ctx.beginPath()
                ctx.arc(d.x, d.y, 1.0 + prox * 2.5, 0, 2 * Math.PI)
                ctx.fill()
            }

            if (trail) {
                const now = performance.now()
                const tr = trailRef.current
                ctx.lineCap = "round"
                ctx.lineJoin = "round"
                for (let i = 1; i < tr.length; i++) {
                    const a = tr[i - 1]
                    const b = tr[i]
                    const age = now - b.t
                    if (age > 260) continue
                    ctx.globalAlpha = Math.max(0, 1 - age / 260) * 0.85
                    ctx.strokeStyle = trColor
                    ctx.lineWidth = 2
                    ctx.beginPath()
                    ctx.moveTo(a.x, a.y)
                    ctx.lineTo(b.x, b.y)
                    ctx.stroke()
                }
            }

            ctx.globalAlpha = 1
            raf = requestAnimationFrame(frame)
        }
        raf = requestAnimationFrame(frame)

        return () => {
            cancelAnimationFrame(raf)
            ro?.disconnect()
            window.removeEventListener("mousemove", onMove)
            host.removeEventListener("mouseleave", onLeave)
            window.removeEventListener("touchmove", onTouch)
            window.removeEventListener("touchend", onLeave)
        }
    }, [bg, dot, trColor, spacing, radius, strength, trail, isJournalActive, isFocusJournal])

    return (
        <div
            ref={hostRef}
            style={{
                position: "fixed",
                inset: 0,
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                background: bg,
                zIndex: -1,
                pointerEvents: "none",
                ...style,
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    opacity: (isJournalActive || isFocusJournal) ? 0 : 1,
                    transition: "opacity 0.8s ease",
                }}
            />
        </div>
    )
}
