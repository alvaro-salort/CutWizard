# CutWizard

![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8?style=flat-square&logo=tailwind-css)

CutWizard is a lightweight tool that helps you figure out the smartest way to cut your boards, sheets, or panels.  
Drop in your materials, add your parts, and boom — instant cut plan. Kerf included, drama excluded.

---

## 🔑 Key Features

* **Guillotine-Cut Algorithm**  
  A custom algorithm designed to keep layouts shop-friendly and “non-chaotic.” Every cut goes edge-to-edge.

* **Optimization Goodies**
  * **Auto Layout:** One click.
  * **Piece Rotation:** Because sometimes turning things sideways solves life.
  * **Kerf Awareness:** The blade has feelings too — we account for its width.

* **Offcut Management**  
  Shows exactly what leftovers you’ll get, so you can pretend you’re being sustainable and not just hoarding scrap wood.

* **Modern UI**
  * Built with **Tailwind**, so it looks clean.
  * Dark/Light mode for day shift, night shift.
  * Interactive SVG layout viewer — drag nothing, admire everything.

* **Handy Reports**
  * Working on it...

---

## 🚀 Tech Stack

* **React 19** – modern, fast, and full of Hooks you’ll pretend to understand.  
* **TypeScript** – helps prevent math crimes.  
* **Tailwind CSS** – because writing CSS manually is for people braver than me.  
* **Custom 2D bin-packing logic** – written by hand, because AI can’t have all the fun (por ahora).

---

## 🧠 How the Algorithm Works

CutWizard follows a simple but effective flow:

1. Sort pieces from biggest to smallest (because size *does* matter here).  
2. Try both orientations.  
3. Pick the spot that wastes the least space.  
4. Split leftover zones into new rectangles.  
5. Repeat until everything fits… or physics gives up.

The whole thing uses strict **Guillotine Cuts**, making the final plan actually buildable in a real workshop.

---



<img width="1346" height="628" alt="image" src="https://github.com/user-attachments/assets/6917b2a7-b664-43bc-9cf6-558a9747cbe1" />


---

## 🤝 Contributing

PRs, issues, ideas — all welcome.  
If you want to break it, improve it, or make it do something weird, go for it.

1. Fork the repo  
2. Create a branch  
3. Do your magic  
4. Send a PR  
5. Celebrate responsibly  

---

## 📄 License

This project is basically “free to use, modify, break, rebuild, and brag about.”  
Do whatever you want with it. No lawyers involved.

---

Built with ❤️ — mostly as an excuse to learn, experiment, and become slightly less terrible at coding.  
If it helps someone else along the way, even better.
