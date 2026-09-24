"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.DEFAULT_TEMPLATES = void 0;

exports.DEFAULT_TEMPLATES = [
    {
        id: "tpl-eid-greeting",
        title: "ঈদ মোবারক / উৎসব শুভেচ্ছা — Eid Greeting Poster",
        occasion_type: "eid_greeting",
        thumbnail_url: "/templates/eid-greeting.svg",
        layout_config: {
            svgPath: "/templates/eid-greeting.svg",
            primaryColor: "#7f1d1d",
            secondaryColor: "#991b1b",
            accentColor: "#ffd700",
            font: "Noto Sans Bengali",
        },
        is_active: true,
        created_at: new Date().toISOString(),
    },
    {
        id: "tpl-political-campaign",
        title: "নির্বাচনী প্রচারণা / সমাবেশ — Political Campaign Poster",
        occasion_type: "political_campaign",
        thumbnail_url: "/templates/political-campaign.svg",
        layout_config: {
            svgPath: "/templates/political-campaign.svg",
            primaryColor: "#006a4e",
            secondaryColor: "#f42a41",
            accentColor: "#ffd700",
            font: "Noto Sans Bengali",
        },
        is_active: true,
        created_at: new Date().toISOString(),
    },
    {
        id: "tpl-condolence",
        title: "শোক ও শ্রদ্ধা / স্মরণসভা — Memorial Tribute Poster",
        occasion_type: "condolence",
        thumbnail_url: "/templates/condolence.svg",
        layout_config: {
            svgPath: "/templates/condolence.svg",
            primaryColor: "#064e3b",
            secondaryColor: "#fef08a",
            accentColor: "#ca8a04",
            font: "Noto Sans Bengali",
        },
        is_active: true,
        created_at: new Date().toISOString(),
    },
    {
        id: "tpl-tribute",
        title: "শ্রদ্ধাঞ্জলি / সমাবেশ — Rally & Slogan Poster",
        occasion_type: "tribute",
        thumbnail_url: "/templates/tribute.svg",
        layout_config: {
            svgPath: "/templates/tribute.svg",
            primaryColor: "#0f172a",
            secondaryColor: "#b91c1c",
            accentColor: "#f59e0b",
            font: "Noto Sans Bengali",
        },
        is_active: true,
        created_at: new Date().toISOString(),
    },
];