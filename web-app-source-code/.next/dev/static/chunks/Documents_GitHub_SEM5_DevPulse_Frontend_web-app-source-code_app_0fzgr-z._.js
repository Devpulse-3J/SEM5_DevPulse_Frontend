(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function Card({ children, className = "", padding = "md", borderLeftColor }) {
    const paddingClasses = {
        none: "p-0",
        sm: "p-3",
        md: "p-4.5",
        lg: "p-6"
    };
    const borderLeftStyle = borderLeftColor ? {
        borderLeft: `3px solid ${borderLeftColor}`
    } : {};
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            backgroundColor: "var(--dp-surface)",
            borderColor: "var(--dp-border)",
            ...borderLeftStyle
        },
        className: `border rounded-[10px] ${paddingClasses[padding]} ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Card.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
_c = Card;
var _c;
__turbopack_context__.k.register(_c, "Card");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/RiskBadge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RiskBadge",
    ()=>RiskBadge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function RiskBadge({ level, score, className = "" }) {
    const levelStyles = {
        LOW: {
            bg: "rgba(34, 197, 94, 0.35)",
            color: "oklch(0.78 0.15 155)",
            label: "LOW RISK"
        },
        MED: {
            bg: "rgba(245, 158, 11, 0.35)",
            color: "oklch(0.83 0.14 80)",
            label: "MED RISK"
        },
        HIGH: {
            bg: "rgba(239, 68, 68, 0.35)",
            color: "oklch(0.78 0.16 22)",
            label: "HIGH RISK"
        }
    };
    const current = levelStyles[level];
    const text = score !== undefined ? `${level === "LOW" ? "LOW" : level} · ${score}` : current.label;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        style: {
            backgroundColor: current.bg,
            color: current.color
        },
        className: `inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-[5px] tracking-wide font-mono ${className}`,
        children: text
    }, void 0, false, {
        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/RiskBadge.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
_c = RiskBadge;
var _c;
__turbopack_context__.k.register(_c, "RiskBadge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/StatusBadge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StatusBadge",
    ()=>StatusBadge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function StatusBadge({ status = "NEUTRAL", text, dot, className = "" }) {
    if (status === "CONNECTED" || status === "ATTENTION" || status === "NOT_CONNECTED") {
        const configs = {
            CONNECTED: {
                color: "oklch(0.72 0.16 155)",
                label: "CONNECTED"
            },
            ATTENTION: {
                color: "oklch(0.78 0.16 80)",
                label: "ATTENTION"
            },
            NOT_CONNECTED: {
                color: "oklch(0.52 0.02 260)",
                label: "NOT CONNECTED"
            }
        };
        const cfg = configs[status];
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            style: {
                backgroundColor: "var(--dp-surface-raised)",
                color: cfg.color
            },
            className: `inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.25 py-0.75 rounded-[5px] font-mono ${className}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    style: {
                        backgroundColor: cfg.color
                    },
                    className: "w-1.5 h-1.5 rounded-full inline-block"
                }, void 0, false, {
                    fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/StatusBadge.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, this),
                text || cfg.label
            ]
        }, void 0, true, {
            fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/StatusBadge.tsx",
            lineNumber: 42,
            columnNumber: 7
        }, this);
    }
    if (status === "ESCALATED" || status === "CHANGES_REQ") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            style: {
                backgroundColor: "rgba(239, 68, 68, 0.35)",
                color: "oklch(0.78 0.16 22)"
            },
            className: `inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-[5px] ${className}`,
            children: text || (status === "ESCALATED" ? "ESCALATED" : "CHANGES REQ.")
        }, void 0, false, {
            fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/StatusBadge.tsx",
            lineNumber: 60,
            columnNumber: 7
        }, this);
    }
    if (status === "WAITING") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            style: {
                backgroundColor: "rgba(245, 158, 11, 0.35)",
                color: "oklch(0.83 0.14 80)"
            },
            className: `inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-[5px] ${className}`,
            children: text || "WAITING"
        }, void 0, false, {
            fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/StatusBadge.tsx",
            lineNumber: 74,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        style: {
            backgroundColor: "var(--dp-surface-raised)",
            color: "var(--dp-text-secondary)"
        },
        className: `inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.25 py-0.75 rounded-[5px] ${className}`,
        children: [
            dot && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "w-1.5 h-1.5 rounded-full bg-[var(--dp-text-secondary)] inline-block"
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/StatusBadge.tsx",
                lineNumber: 95,
                columnNumber: 9
            }, this),
            text
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/StatusBadge.tsx",
        lineNumber: 87,
        columnNumber: 5
    }, this);
}
_c = StatusBadge;
var _c;
__turbopack_context__.k.register(_c, "StatusBadge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/MetricCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MetricCard",
    ()=>MetricCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$app$2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Card.tsx [app-client] (ecmascript)");
;
;
function MetricCard({ title, value, unit, borderColor, trendText, trendColor, sparklineBars }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$app$2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        borderLeftColor: borderColor,
        padding: "md",
        className: "flex flex-col justify-between",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-[var(--dp-text-secondary)] mb-2.5 font-medium",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/MetricCard.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "font-mono text-[30px] font-semibold tracking-tight text-[var(--dp-text-primary)] leading-none",
                        children: [
                            value,
                            unit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-sans font-normal text-[var(--dp-text-secondary)] ml-0.5",
                                children: unit
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/MetricCard.tsx",
                                lineNumber: 38,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/MetricCard.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/MetricCard.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-end gap-[3px] h-[28px] mt-2.5",
                        children: sparklineBars.map((bar, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    height: `${bar.heightPct}%`,
                                    backgroundColor: bar.color || (bar.highlighted ? borderColor : "rgba(255,255,255,0.15)")
                                },
                                className: "w-1.5 rounded-[2px] transition-all"
                            }, i, false, {
                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/MetricCard.tsx",
                                lineNumber: 49,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/MetricCard.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            color: trendColor
                        },
                        className: "text-[11px] font-semibold mt-2 font-sans tracking-tight",
                        children: trendText
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/MetricCard.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/MetricCard.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/MetricCard.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
_c = MetricCard;
var _c;
__turbopack_context__.k.register(_c, "MetricCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Header",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function Header() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        style: {
            backgroundColor: "var(--dp-app-bg)",
            borderColor: "var(--dp-border-subtle)"
        },
        className: "h-[56px] border-b flex items-center justify-between px-5 sticky top-0 z-40",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-mono font-bold text-[15px] tracking-wide text-[var(--dp-text-primary)] flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[var(--dp-accent)]",
                                children: "◆"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Header.tsx",
                                lineNumber: 15,
                                columnNumber: 11
                            }, this),
                            " DEVPULSE"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Header.tsx",
                        lineNumber: 14,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            backgroundColor: "var(--dp-border)"
                        },
                        className: "w-[1px] h-5"
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Header.tsx",
                        lineNumber: 18,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            backgroundColor: "var(--dp-surface)",
                            borderColor: "var(--dp-border)"
                        },
                        className: "flex items-center gap-1.5 text-xs font-medium border px-2.5 py-1.5 rounded-[7px] text-[var(--dp-text-primary)] cursor-pointer hover:bg-[var(--dp-surface-raised)] transition-colors",
                        children: [
                            "Nimbus Labs ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[var(--dp-text-dim)]",
                                children: "/"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Header.tsx",
                                lineNumber: 30,
                                columnNumber: 23
                            }, this),
                            " ",
                            "platform-core ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[var(--dp-text-dim)] ml-1",
                                children: "⌄"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Header.tsx",
                                lineNumber: 31,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Header.tsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Header.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                title: "GitHub Integration: Connected",
                                style: {
                                    backgroundColor: "var(--dp-surface-raised)",
                                    color: "var(--dp-risk-low)",
                                    borderColor: "var(--dp-border)"
                                },
                                className: "w-5.5 h-5.5 rounded-md border flex items-center justify-center font-mono text-[10px] font-bold cursor-default",
                                children: "GH"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Header.tsx",
                                lineNumber: 38,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                title: "Jira Integration: Connected",
                                style: {
                                    backgroundColor: "var(--dp-surface-raised)",
                                    color: "var(--dp-risk-low)",
                                    borderColor: "var(--dp-border)"
                                },
                                className: "w-5.5 h-5.5 rounded-md border flex items-center justify-center font-mono text-[10px] font-bold cursor-default",
                                children: "JR"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Header.tsx",
                                lineNumber: 49,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                title: "Slack Integration: Attention Required",
                                style: {
                                    backgroundColor: "var(--dp-surface-raised)",
                                    color: "var(--dp-risk-med-text)",
                                    borderColor: "var(--dp-border)"
                                },
                                className: "w-5.5 h-5.5 rounded-md border flex items-center justify-center font-mono text-[10px] font-bold cursor-default",
                                children: "SL"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Header.tsx",
                                lineNumber: 60,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Header.tsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            backgroundColor: "var(--dp-border)"
                        },
                        className: "w-[1px] h-5"
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Header.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            backgroundColor: "var(--dp-surface-raised)",
                            color: "var(--dp-accent)",
                            borderColor: "var(--dp-border)"
                        },
                        className: "text-[12px] font-semibold px-2.5 py-1 rounded-[6px] border cursor-pointer hover:border-[var(--dp-accent)] transition-colors",
                        children: "Manager ⌄"
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Header.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            backgroundColor: "oklch(0.30 0.08 264)"
                        },
                        className: "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-sm",
                        children: "SC"
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Header.tsx",
                        lineNumber: 89,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Header.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Header.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sidebar",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const MENU_ITEMS = [
    {
        id: "overview",
        label: "Overview",
        icon: "▣",
        category: "MONITOR"
    },
    {
        id: "dora",
        label: "DORA Metrics",
        icon: "◧",
        category: "MONITOR"
    },
    {
        id: "pr-risk",
        label: "PR Risk & Insights",
        icon: "▲",
        category: "MONITOR"
    },
    {
        id: "team",
        label: "Team & Workload",
        icon: "◫",
        category: "MONITOR"
    },
    {
        id: "integrations",
        label: "Integrations",
        icon: "◎",
        category: "CONFIGURE"
    },
    {
        id: "settings",
        label: "Settings",
        icon: "⚙",
        category: "CONFIGURE"
    }
];
function Sidebar({ activeId = "overview", onSelect }) {
    _s();
    const [current, setCurrent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(activeId);
    const handleItemClick = (id)=>{
        setCurrent(id);
        if (onSelect) {
            onSelect(id);
        }
    };
    const renderSection = (category, title)=>{
        const items = MENU_ITEMS.filter((item)=>item.category === category);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-0.5",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-[11px] font-semibold text-[var(--dp-text-dim)] tracking-wider px-2.5 pt-3 pb-1 uppercase",
                    children: title
                }, void 0, false, {
                    fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Sidebar.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this),
                items.map((item)=>{
                    const isActive = current === item.id;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>handleItemClick(item.id),
                        style: {
                            backgroundColor: isActive ? "var(--dp-surface-raised)" : "transparent",
                            color: isActive ? "var(--dp-text-primary)" : "var(--dp-text-secondary)"
                        },
                        className: `flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13px] text-left transition-colors w-full ${isActive ? "font-semibold" : "font-normal hover:bg-white/5"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm opacity-90",
                                children: item.icon
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Sidebar.tsx",
                                lineNumber: 58,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: item.label
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Sidebar.tsx",
                                lineNumber: 59,
                                columnNumber: 15
                            }, this)
                        ]
                    }, item.id, true, {
                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Sidebar.tsx",
                        lineNumber: 47,
                        columnNumber: 13
                    }, this);
                })
            ]
        }, void 0, true, {
            fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Sidebar.tsx",
            lineNumber: 40,
            columnNumber: 7
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        style: {
            borderColor: "var(--dp-border-subtle)",
            backgroundColor: "var(--dp-app-bg)"
        },
        className: "w-[212px] shrink-0 border-r p-3 flex flex-col gap-2 min-h-[calc(100vh-56px)] select-none",
        children: [
            renderSection("MONITOR", "MONITOR"),
            renderSection("CONFIGURE", "CONFIGURE")
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Sidebar.tsx",
        lineNumber: 68,
        columnNumber: 5
    }, this);
}
_s(Sidebar, "BU2vUeBhYKr5PsD7/2ANrwTv3l4=");
_c = Sidebar;
var _c;
__turbopack_context__.k.register(_c, "Sidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$app$2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$app$2f$components$2f$RiskBadge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/RiskBadge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$app$2f$components$2f$StatusBadge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/StatusBadge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$app$2f$components$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/MetricCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$app$2f$components$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$app$2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Sidebar.tsx [app-client] (ecmascript)");
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OverviewDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$app$2f$components$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$app$2f$components$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$app$2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$app$2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$app$2f$components$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/MetricCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$app$2f$components$2f$RiskBadge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/RiskBadge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$app$2f$components$2f$StatusBadge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/components/StatusBadge.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function OverviewDashboard() {
    _s();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("overview");
    // DORA Metrics Data
    const doraMetrics = [
        {
            title: "Deployment Frequency",
            value: "6.2",
            unit: "/day",
            borderColor: "oklch(0.72 0.16 155)",
            trendText: "▲ Elite · +0.8 vs prior period",
            trendColor: "oklch(0.72 0.16 155)",
            sparklineBars: [
                {
                    heightPct: 40
                },
                {
                    heightPct: 55
                },
                {
                    heightPct: 50
                },
                {
                    heightPct: 70
                },
                {
                    heightPct: 65
                },
                {
                    heightPct: 85,
                    highlighted: true
                },
                {
                    heightPct: 100,
                    highlighted: true
                }
            ]
        },
        {
            title: "Lead Time for Changes",
            value: "4.1",
            unit: "hrs",
            borderColor: "oklch(0.72 0.16 155)",
            trendText: "▼ Elite · −1.4hrs vs prior period",
            trendColor: "oklch(0.72 0.16 155)",
            sparklineBars: [
                {
                    heightPct: 80,
                    color: "rgba(251,191,36,0.4)"
                },
                {
                    heightPct: 70,
                    color: "rgba(251,191,36,0.4)"
                },
                {
                    heightPct: 60,
                    color: "rgba(74,222,128,0.4)"
                },
                {
                    heightPct: 55,
                    color: "rgba(74,222,128,0.4)"
                },
                {
                    heightPct: 40,
                    highlighted: true
                },
                {
                    heightPct: 35,
                    highlighted: true
                },
                {
                    heightPct: 30,
                    highlighted: true
                }
            ]
        },
        {
            title: "Mean Time to Recovery",
            value: "2.8",
            unit: "hrs",
            borderColor: "oklch(0.78 0.16 80)",
            trendText: "▲ High · +0.6hrs vs prior period",
            trendColor: "oklch(0.83 0.14 80)",
            sparklineBars: [
                {
                    heightPct: 30,
                    color: "rgba(74,222,128,0.4)"
                },
                {
                    heightPct: 35,
                    color: "rgba(74,222,128,0.4)"
                },
                {
                    heightPct: 60,
                    color: "rgba(251,191,36,0.4)"
                },
                {
                    heightPct: 55,
                    color: "rgba(251,191,36,0.4)"
                },
                {
                    heightPct: 65,
                    highlighted: true
                },
                {
                    heightPct: 50,
                    highlighted: true
                },
                {
                    heightPct: 58,
                    highlighted: true
                }
            ]
        },
        {
            title: "Change Failure Rate",
            value: "18.4",
            unit: "%",
            borderColor: "oklch(0.66 0.19 22)",
            trendText: "▲ Needs Attention · +3.1pp vs prior period",
            trendColor: "oklch(0.78 0.16 22)",
            sparklineBars: [
                {
                    heightPct: 35,
                    color: "rgba(74,222,128,0.4)"
                },
                {
                    heightPct: 40,
                    color: "rgba(74,222,128,0.4)"
                },
                {
                    heightPct: 45,
                    color: "rgba(251,191,36,0.4)"
                },
                {
                    heightPct: 55,
                    color: "oklch(0.78 0.16 80)"
                },
                {
                    heightPct: 75,
                    highlighted: true
                },
                {
                    heightPct: 80,
                    highlighted: true
                },
                {
                    heightPct: 90,
                    highlighted: true
                }
            ]
        }
    ];
    // Repository Deployments
    const repoDeploys = [
        {
            repo: "api-gateway",
            count: 42,
            pct: "88%"
        },
        {
            repo: "web-app",
            count: 34,
            pct: "70%"
        },
        {
            repo: "payments-svc",
            count: 25,
            pct: "52%"
        },
        {
            repo: "mobile-ios",
            count: 14,
            pct: "30%"
        },
        {
            repo: "data-pipeline",
            count: 9,
            pct: "20%"
        }
    ];
    // High-Risk PRs Data
    const highRiskPRs = [
        {
            riskLevel: "HIGH",
            score: "0.92",
            id: "#4128",
            title: "Refactor auth token rotation",
            author: "M. Webb",
            openDuration: "11d",
            diffSize: "+890"
        },
        {
            riskLevel: "HIGH",
            score: "0.87",
            id: "#4131",
            title: "Payment retry queue rewrite",
            author: "D. Alvarez",
            openDuration: "8d",
            diffSize: "+612"
        },
        {
            riskLevel: "MED",
            score: "0.58",
            id: "#4140",
            title: "Mobile push notification retry",
            author: "A. Osei",
            openDuration: "4d",
            diffSize: "+205"
        },
        {
            riskLevel: "MED",
            score: "0.51",
            id: "#4145",
            title: "Data pipeline schema migration",
            author: "J. Kim",
            openDuration: "3d",
            diffSize: "+340"
        }
    ];
    // Alerts Feed Data
    const alertsFeed = [
        {
            id: 1,
            type: "danger",
            dotColor: "oklch(0.78 0.16 22)",
            bgStyle: "rgba(239,68,68,0.15)",
            borderStyle: "1px solid rgba(239,68,68,0.4)",
            title: "Build failing 3x — api-gateway/main",
            subtitle: "Triggered by #4128 · 22 min ago"
        },
        {
            id: 2,
            type: "warning",
            dotColor: "oklch(0.83 0.14 80)",
            bgStyle: "rgba(245,158,11,0.15)",
            borderStyle: "1px solid rgba(245,158,11,0.4)",
            title: "Review overdue 48h+ on 5 PRs",
            subtitle: "Assigned to P. Patel · 1 hr ago"
        },
        {
            id: 3,
            type: "warning",
            dotColor: "oklch(0.83 0.14 80)",
            bgStyle: "rgba(245,158,11,0.15)",
            borderStyle: "1px solid rgba(245,158,11,0.4)",
            title: "T. Reilly overloaded — 9 active PRs",
            subtitle: "190% of team avg · 3 hrs ago"
        },
        {
            id: 4,
            type: "info",
            dotColor: "oklch(0.68 0.17 264)",
            bgStyle: "var(--dp-surface-raised)",
            borderStyle: "1px solid var(--dp-border)",
            title: "Stale PR warning — #4098 idle 9 days",
            subtitle: "Author E. Rossi · 5 hrs ago"
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex flex-col bg-[var(--dp-app-bg)] text-[var(--dp-text-primary)]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$app$2f$components$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Header"], {}, void 0, false, {
                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                lineNumber: 188,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$app$2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sidebar"], {
                        activeId: activeTab,
                        onSelect: setActiveTab
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                        lineNumber: 193,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 p-6 md:p-7 flex flex-col gap-5 max-w-[1600px] w-full overflow-x-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                        className: "text-2xl font-bold tracking-tight text-[var(--dp-text-primary)]",
                                                        children: activeTab === "overview" ? "Overview" : activeTab.toUpperCase().replace("-", " ")
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                        lineNumber: 201,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$app$2f$components$2f$StatusBadge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusBadge"], {
                                                        text: "MANAGER VIEW"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                        lineNumber: 206,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                lineNumber: 200,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-[var(--dp-text-dim)] mt-1 font-mono",
                                                children: "platform-core · 34 repos · updated 2 min ago"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                lineNumber: 208,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                        lineNumber: 199,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                style: {
                                                    backgroundColor: "var(--dp-surface)",
                                                    borderColor: "var(--dp-border)"
                                                },
                                                className: "text-xs px-3 py-1.75 rounded-[7px] border text-[var(--dp-text-primary)] font-medium hover:bg-[var(--dp-surface-raised)] transition-colors cursor-pointer",
                                                children: "All Teams ⌄"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                lineNumber: 215,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                style: {
                                                    backgroundColor: "var(--dp-surface)",
                                                    borderColor: "var(--dp-border)"
                                                },
                                                className: "text-xs px-3 py-1.75 rounded-[7px] border text-[var(--dp-text-primary)] font-medium hover:bg-[var(--dp-surface-raised)] transition-colors cursor-pointer",
                                                children: "Last 30 days ⌄"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                lineNumber: 224,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                        lineNumber: 214,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                lineNumber: 198,
                                columnNumber: 11
                            }, this),
                            activeTab !== "overview" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$app$2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                className: "p-8 text-center my-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "font-mono text-sm text-[var(--dp-accent)] font-semibold mb-2",
                                        children: "MODULE BASE READY"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                        lineNumber: 239,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-lg font-bold text-[var(--dp-text-primary)] mb-2",
                                        children: [
                                            activeTab.toUpperCase().replace("-", " "),
                                            " View Scaffold"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                        lineNumber: 242,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-[var(--dp-text-secondary)] max-w-md mx-auto leading-relaxed",
                                        children: "This route scaffold uses the shared DevPulse UI theme components. Other developers can build the full detail view for this screen using the established design system tokens."
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                        lineNumber: 245,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                lineNumber: 238,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5",
                                children: doraMetrics.map((metric, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$app$2f$components$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                                        title: metric.title,
                                        value: metric.value,
                                        unit: metric.unit,
                                        borderColor: metric.borderColor,
                                        trendText: metric.trendText,
                                        trendColor: metric.trendColor,
                                        sparklineBars: metric.sparklineBars
                                    }, idx, false, {
                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                        lineNumber: 254,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                lineNumber: 252,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 lg:grid-cols-3 gap-3.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$app$2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                        className: "lg:col-span-2 flex flex-col justify-between",
                                        padding: "md",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-center mb-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-xs md:text-sm font-semibold text-[var(--dp-text-primary)]",
                                                        children: "Lead Time Trend — 12 Weeks"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                        lineNumber: 272,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[11px] text-[var(--dp-text-dim)] font-mono",
                                                        children: "median, hrs"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                        lineNumber: 275,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                lineNumber: 271,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-full h-[180px] my-1",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    viewBox: "0 0 640 180",
                                                    className: "w-full h-full overflow-visible",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                            x1: "0",
                                                            y1: "30",
                                                            x2: "640",
                                                            y2: "30",
                                                            stroke: "var(--dp-border-subtle)",
                                                            strokeWidth: "1"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                            lineNumber: 287,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                            x1: "0",
                                                            y1: "80",
                                                            x2: "640",
                                                            y2: "80",
                                                            stroke: "var(--dp-border-subtle)",
                                                            strokeWidth: "1"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                            lineNumber: 295,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                            x1: "0",
                                                            y1: "130",
                                                            x2: "640",
                                                            y2: "130",
                                                            stroke: "var(--dp-border-subtle)",
                                                            strokeWidth: "1"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                            lineNumber: 303,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                                                            points: "0,110 58,100 116,105 174,90 232,95 290,70 348,75 406,55 464,60 522,45 580,40 640,35 640,180 0,180",
                                                            fill: "rgba(99,102,241,0.12)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                            lineNumber: 313,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                            points: "0,110 58,100 116,105 174,90 232,95 290,70 348,75 406,55 464,60 522,45 580,40 640,35",
                                                            fill: "none",
                                                            stroke: "var(--dp-accent)",
                                                            strokeWidth: "2.5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                            lineNumber: 319,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                    lineNumber: 282,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                lineNumber: 281,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between text-[10px] text-[var(--dp-text-dim)] font-mono mt-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "W1"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                        lineNumber: 330,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "W3"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                        lineNumber: 331,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "W5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                        lineNumber: 332,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "W7"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                        lineNumber: 333,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "W9"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                        lineNumber: 334,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "W11"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                        lineNumber: 335,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                lineNumber: 329,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                        lineNumber: 270,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$app$2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                        padding: "md",
                                        className: "flex flex-col justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-xs md:text-sm font-semibold text-[var(--dp-text-primary)] mb-3",
                                                children: "Deploys by Repo (7d)"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                lineNumber: 341,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col gap-2.5",
                                                children: repoDeploys.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2 text-xs",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "w-[88px] text-[11px] text-[var(--dp-text-secondary)] truncate",
                                                                children: item.repo
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                                lineNumber: 347,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1 h-2 bg-[var(--dp-surface-raised)] rounded-full overflow-hidden",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        width: item.pct,
                                                                        backgroundColor: "var(--dp-accent)"
                                                                    },
                                                                    className: "h-full rounded-full"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                                    lineNumber: 351,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                                lineNumber: 350,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-mono text-[11px] text-[var(--dp-text-primary)] w-6 text-right",
                                                                children: item.count
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                                lineNumber: 359,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, idx, true, {
                                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                        lineNumber: 346,
                                                        columnNumber: 19
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                lineNumber: 344,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                        lineNumber: 340,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                lineNumber: 268,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 lg:grid-cols-3 gap-3.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$app$2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                        className: "lg:col-span-2 overflow-hidden",
                                        padding: "none",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-center p-4.5 pb-2.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-xs md:text-sm font-semibold text-[var(--dp-text-primary)]",
                                                        children: "High-Risk Pull Requests"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                        lineNumber: 373,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[11px] text-[var(--dp-accent)] cursor-pointer hover:underline",
                                                        children: "View all →"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                        lineNumber: 376,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                lineNumber: 372,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-12 px-4.5 py-2 text-[11px] text-[var(--dp-text-dim)] font-semibold border-b border-[var(--dp-border-muted)] font-mono",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "col-span-3",
                                                        children: "RISK"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                        lineNumber: 383,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "col-span-5",
                                                        children: "PULL REQUEST"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                        lineNumber: 384,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "col-span-2",
                                                        children: "AUTHOR"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                        lineNumber: 385,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "col-span-1",
                                                        children: "OPEN"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                        lineNumber: 386,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "col-span-1 text-right",
                                                        children: "SIZE"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                        lineNumber: 387,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                lineNumber: 382,
                                                columnNumber: 15
                                            }, this),
                                            highRiskPRs.map((pr, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `grid grid-cols-12 px-4.5 py-2.75 items-center text-xs border-b border-[var(--dp-border-muted)] last:border-b-0 hover:bg-white/[0.02] transition-colors`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "col-span-3",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$app$2f$components$2f$RiskBadge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RiskBadge"], {
                                                                level: pr.riskLevel,
                                                                score: pr.score
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                                lineNumber: 397,
                                                                columnNumber: 21
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                            lineNumber: 396,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "col-span-5 font-medium text-[var(--dp-text-primary)] truncate pr-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-mono text-[var(--dp-text-secondary)] mr-1.5",
                                                                    children: pr.id
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                                    lineNumber: 400,
                                                                    columnNumber: 21
                                                                }, this),
                                                                pr.title
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                            lineNumber: 399,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "col-span-2 text-[var(--dp-text-secondary)] truncate",
                                                            children: pr.author
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                            lineNumber: 405,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                color: pr.riskLevel === "HIGH" ? "var(--dp-risk-high-text)" : "var(--dp-risk-med-text)"
                                                            },
                                                            className: "col-span-1 font-semibold text-[11px]",
                                                            children: pr.openDuration
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                            lineNumber: 408,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "col-span-1 font-mono text-[var(--dp-text-secondary)] text-right text-[11px]",
                                                            children: pr.diffSize
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                            lineNumber: 419,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, index, true, {
                                                    fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 17
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                        lineNumber: 371,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$app$2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                        padding: "md",
                                        className: "flex flex-col",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-xs md:text-sm font-semibold text-[var(--dp-text-primary)] mb-3",
                                                children: "Real-Time Bottleneck Alerts"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                lineNumber: 428,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col gap-2.5 flex-1",
                                                children: alertsFeed.map((alert)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            backgroundColor: alert.bgStyle,
                                                            border: alert.borderStyle
                                                        },
                                                        className: "flex gap-2.5 p-2.5 rounded-lg transition-all",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: alert.dotColor
                                                                },
                                                                className: "text-xs font-bold mt-0.5 leading-none",
                                                                children: "●"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                                lineNumber: 441,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-xs font-semibold text-[var(--dp-text-primary)] leading-snug",
                                                                        children: alert.title
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                                        lineNumber: 448,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$SEM5_DevPulse_Frontend$2f$web$2d$app$2d$source$2d$code$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-[11px] text-[var(--dp-text-secondary)] mt-0.5",
                                                                        children: alert.subtitle
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                                        lineNumber: 451,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                                lineNumber: 447,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, alert.id, true, {
                                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                        lineNumber: 433,
                                                        columnNumber: 19
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                                lineNumber: 431,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                        lineNumber: 427,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                                lineNumber: 369,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                        lineNumber: 196,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
                lineNumber: 191,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/GitHub/SEM5_DevPulse_Frontend/web-app-source-code/app/page.tsx",
        lineNumber: 186,
        columnNumber: 5
    }, this);
}
_s(OverviewDashboard, "0RhE9c0qkQp+3CR2mJOCewxRmMU=");
_c = OverviewDashboard;
var _c;
__turbopack_context__.k.register(_c, "OverviewDashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Documents_GitHub_SEM5_DevPulse_Frontend_web-app-source-code_app_0fzgr-z._.js.map