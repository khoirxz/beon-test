# SKILL FIT TEST - FULL STACK PROGRAMMER

# Apa yang dibutuhkan ?

Saya menggunakan Laravel 12(PHP 8.4) dan NodeJS Versi 22 untuk membuat aplikasi ini.
Untuk database saya menggunakan MYSQL versi 5.7

Sebelum proses instalasi, pastikan sudah terinstall PHP dan NodeJS dengan versi yang sesuai.

# INSTALASI

## Instalasi Backend

Unduh file dari github atau clone terlebih dahulu

```bash
git clone https://github.com/khoirxz/beon-test.git
```

kemudian masuk ke folder beon-test dan lakukan perintah berikut

```bash
composer install
```

## Konfigurasi Database

Buka file .env dan sesuaikan dengan konfigurasi database anda, terutama DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD

Migrasi database

```bash
php artisan migrate
```

Jika proses berhasil, jalankan perintah berikut untuk menjalankan laravel di environment development

```bash
php artisan serve
```

# Instalasi Frontend

Masuk ke folder frontend lalu jalankan perintah berikut

```bash
npm install
```

(Sesuaikan dengan package manager anda seperti npm, pnpm, yarn)

## Konfigurasi API

Buka file `src/api/index.ts` dan sesuaikan dengan konfigurasi API backend

Kemudian jalankan perintah berikut untuk menjalankan frontend

```bash
npm run dev
```
