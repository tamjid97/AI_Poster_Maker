"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACCEPTED_IMAGE_TYPES = exports.MAX_FILE_SIZE = exports.MAX_PHOTOS = exports.MAX_REGENERATE_COUNT = exports.STATUS_LABELS = exports.OCCASION_OPTIONS = exports.OCCASION_LABELS = void 0;
exports.OCCASION_LABELS = {
    victory_day: 'Victory Day',
    condolence: 'Condolence / Tribute',
    eid_greeting: 'Eid Greeting',
    political_campaign: 'Political Campaign',
};
exports.OCCASION_OPTIONS = Object.entries(exports.OCCASION_LABELS).map(([value, label]) => ({ value, label }));
exports.STATUS_LABELS = {
    DRAFT: 'Draft',
    GENERATING: 'Generating',
    COMPLETED: 'Completed',
    FAILED: 'Failed',
};
exports.MAX_REGENERATE_COUNT = 3;
exports.MAX_PHOTOS = 3;
exports.MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
exports.ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
