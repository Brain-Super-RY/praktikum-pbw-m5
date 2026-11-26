# UNSIKA TechFest 2026 — Praktikum PBW Modul 5 & 6

Proyek **UNSIKA TechFest 2026** adalah landing page event teknologi kampus (Program Studi Informatika, Fakultas Ilmu Komputer, Universitas Singaperbangsa Karawang) yang dibangun sebagai implementasi terpadu **Modul 5 (Bootstrap 5.3.8)** dan **Modul 6 (Git & GitHub)**.

- **Live Demo (GitHub Pages):** https://brain-super-ry.github.io/praktikum-pbw-m5/
- **Repositori GitHub:** https://github.com/Brain-Super-RY/praktikum-pbw-m5

---

## Struktur Proyek

```text
praktikum-pbw-m5/
├── .gitignore
├── AGENTS.md
├── README.md
├── index.html
├── assets/
│   ├── css/
│   │   └── custom.css      # 3-layer design tokens (primitive -> semantic -> --bs-*) & dark mode
│   └── js/
│       └── main.js         # Dark mode switcher, filter, modal, pagination, live pass & validasi
└── docs/
    └── agents/
        ├── domain.md
        ├── issue-tracker.md
        └── triage-labels.md
```

---

## Pemetaan Cakupan Modul 5 (Bootstrap 5.3.8)

| Subbab Modul 5 | Implementasi pada Proyek |
| :--- | :--- |
| **5.1** Get Started & Containers | Bootstrap `5.3.8` via jsDelivr CDN (dengan atribut SRI `integrity` & `crossorigin`), `.container` |
| **5.2** Grid Basic | Sistem grid 12-kolom Flexbox responsif (`.row`, `.col-lg-*`, `.row-cols-1 .row-cols-md-2 .row-cols-lg-3 .g-4`) |
| **5.3** Typography, Colors, & Tables | `.display-4`, `.lead`, semantic colors, `.table-responsive > .table .table-striped .table-hover .table-bordered` + `.table-dark` |
| **5.4** Images, Jumbotron/Hero, & Alerts | Hero section berbasis utility, visual SVG `.img-fluid`, dan `.alert-warning .alert-dismissible` |
| **5.5** Buttons, Button Groups, Badges, & Progress | `.btn`, `.btn-outline-*`, `.btn-group` filter pembicara, `.badge`, dan `.progress` okupansi kursi |
| **5.6** Spinners, Pagination, & List Groups | `.spinner-border` saat submit, `.pagination` jadwal Hari 1/Hari 2, dan `.list-group` benefit peserta |
| **5.7** Cards, Dropdowns, Collapse, & Navbar | Sticky `.navbar` + `.dropdown`, `.card .h-100` pembicara, dan `.accordion` FAQ |
| **5.8** Carousel, Modal, Tooltip, Popover, & Toast | `#eventCarousel`, `#speakerModal` dinamis, Tooltip & Popover pada kartu pembicara, `#registrationToast` |
| **5.9** Scrollspy, Offcanvas, Utilities, Dark Mode, & Flex | Scrollspy navbar, `.offcanvas` menu seluler, Flex/Spacing utilities, dan `data-bs-theme` persisten (`localStorage`) |
| **5.10** Forms & Select Menus | `.form-label`, `.form-control`, `.form-select` pilihan track workshop |
| **5.11** Checks, Radios, Range, & Input Groups | Radio kategori peserta, `.form-switch`, `.form-range` pengalaman + live badge, `.input-group.has-validation` (`@` & `+62`) |
| **5.12** Floating Labels & Form Validation | `.form-floating`, `needs-validation` + JS `checkValidity()` → `.was-validated` + `.valid-feedback` / `.invalid-feedback` |

---

## Pemetaan Cakupan Modul 6 (Git & GitHub)

| Subbab Modul 6 | Penerapan pada Repositori |
| :--- | :--- |
| **6.1** Git Intro, Install, & Config | Konfigurasi `user.name`, `user.email`, dan `init.defaultBranch main` |
| **6.2** Staging & Commit | Alur `git status`, `git add`, dan Conventional Commits (`chore:`, `feat:`, `fix:`, `docs:`) |
| **6.3** Tagging, Stash, & History | Annotated release tag `v1.0.0` dan riwayat `git log --oneline --graph` |
| **6.4** Branching & Merging | Feature branch workflow (`feat/layout-navigation`, `feat/event-showcase-schedule`, `feat/registration-form`, `fix/ui-polish`, `docs/readme`) |
| **6.5 & 6.6** GitHub Remote, Push, Pull, & Pages | Remote `origin` ke `Brain-Super-RY/praktikum-pbw-m5` + publikasi live di GitHub Pages |
| **6.7** Pull Request (PR) | PR #1–#5 di-review dan di-merge ke `main` dengan penghapusan branch otomatis |
| **6.8 & 6.9** `.gitignore` & Advanced Git | `.gitignore` aktif; panduan latihan aman `stash`, `revert`, `reset`, `reflog`, dan merge conflict di bawah |

---

## Menjalankan Secara Lokal

Cukup buka `index.html` di browser atau jalankan server statis lokal dari root repositori:

```bash
python -m http.server 8080
```

Lalu akses `http://localhost:8080` di browser.

---

## Panduan Latihan Aman Git Lanjutan (Modul 6.8 & 6.9)

Gunakan branch sandbox terpisah agar riwayat `main` tetap bersih:

```bash
# 1. Buat branch latihan khusus
git switch -c sandbox/git-practice

# 2. Praktik stash saat ada perubahan sementara
echo "catatan sementara" >> .scratch-note.txt
git stash
git stash pop

# 3. Praktik amend / reset --soft pada commit lokal yang belum di-push
git add .scratch-note.txt
git commit -m "chore: catatan latihan"
git commit --amend -m "chore: catatan latihan (amended)"
git reset --soft HEAD~1

# 4. Praktik membatalkan commit yang sudah tercatat dengan aman (revert)
git commit -m "chore: commit sementara untuk latihan revert"
git revert HEAD --no-edit

# 5. Kembali ke main dan bersihkan branch sandbox jika selesai
git switch main
git branch -D sandbox/git-practice
```

> **Catatan keamanan:** Jangan pernah menjalankan `git reset --hard` atau `git rebase` pada commit yang sudah di-push ke branch `main` bersama. Gunakan `git revert <commit-hash>` untuk membatalkan perubahan secara aman.
