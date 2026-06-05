# PreSales Box (PreSales Toolbox)

Eine moderne, performante Webanwendung basierend auf **Next.js 14**, **TypeScript** und **Tailwind CSS**, die speziell für PreSales-Consultants und technische Berater entwickelt wurde. Sie bündelt verschiedene Tools zur Hardware-Dimensionierung (Sizing) sowie zur Preiskalkulation und Margenberechnung an einem zentralen Ort.

> 🌐 **Produktiv-Umgebung:** Das Tool ist live unter [pre-sales-tool.vercel.app](https://pre-sales-tool.vercel.app/) erreichbar.

---

## 🚀 Key Features (Hauptfunktionen)

### 👥 Rollenbasiertes Dashboard & Kontextsteuerung
* **Rollen-Auswahl (Context Modal):** Beim ersten Start oder per Wechsel-Option können Benutzer ihren Beratungsschwerpunkt wählen:
  * **Data Center Consultant:** Erhält Zugriff auf alle Infrastruktur-Tools.
  * **Network Consultant:** (In Entwicklung) Maßgeschneiderte Tools für Netzwerke.
  * **Backoffice:** (In Entwicklung) Administrative und kaufmännische Ansichten.
* **Layout & Navigation:** Responsives Layout mit einer einklappbaren Sidebar (Burger-Menü für Mobilgeräte) für eine optimale Bedienung auf allen Displaygrößen.

### 🖥️ Server Sizing Tool
* **Bedarfsanalyse:** Berechnet CPU-, Arbeitsspeicher (RAM)- und Storage-Empfehlungen basierend auf der geplanten Benutzeranzahl und dem Workload-Profil.
* **Dynamische Skalierung:** Berücksichtigt zukünftiges Wachstum und Performance-Puffer direkt in der Ressourcenempfehlung.

### 💾 Storage Sizer
* **Wachstumsprognose:** Ermöglicht die Simulation von Storage-Zuwächsen über mehrere Jahre hinweg (prozentual oder mit absoluten Werten).
* **Konfigurationshilfe:** Hilft bei der Kalkulation von nutzbarem Speicherplatz unter Berücksichtigung von RAID-Typen und Disklayouts.

### 🧮 Listpreisrechner
* **Margen- & Preiskalkulation:** Ermittelt Einkaufspreise (EK), Verkaufspreise (VK) und Margen basierend auf Listenpreisen, Kundenrabatten und Reseller-Rabatten.
* **Deckungsbeitrag:** Zeigt den absoluten Deckungsbeitrag (Marge in Euro) direkt über dem finalen VK-Preis an.
* **State Persistence:** Eingaben bleiben dank der automatischen Speicherung via `localStorage` beim Wechsel zwischen den Tools erhalten.

### 📉 Rabattsatzrechner
* **Einfache Rabatt-Ermittlung:** Errechnet den genauen Rabattsatz in Prozent aus Listenpreis und Einkaufspreis bzw. Verkaufspreis.

---

## 🛠️ Tech Stack & Technologien

* **Frontend Framework:** [Next.js 14](https://nextjs.org/) (App Router)
* **Programmiersprache:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) für ein modernes, konsistentes Utility-First Design
* **Icons:** [Lucide React](https://lucide.dev/) für schlanke Vektorsymbole
* **Datenkonsistenz:** LocalStorage-API für die persistente Speicherung von Calculator-Inputs

---

## 📂 Projektstruktur

```text
├── app/                  # Next.js App Router Pages & Layouts
│   ├── actions.ts        # Server Actions (z. B. Cookie-basiertes Setzen der Benutzerrolle)
│   ├── discount/         # Page für den Rabattsatzrechner
│   ├── pricing/          # Page für den Listpreisrechner
│   ├── sizing/           # Page für das Server Sizing Tool
│   ├── storage/          # Page für den Storage Sizer
│   ├── globals.css       # Globale CSS-Stile & Tailwind Imports
│   └── layout.tsx        # Globales Anwendungs-Layout (inkl. Sidebar & Rolle)
├── components/           # Wiederverwendbare UI-Komponenten
│   ├── ContextModal.tsx  # Modal zur Rollenauswahl (Data Center, Network, etc.)
│   ├── Sidebar.tsx       # Einklappbare Sidebar für Desktop und Mobile
│   ├── SizingTool.tsx    # Kernlogik & UI für Server Sizing
│   ├── StorageSizer.tsx  # Kernlogik & UI für den Storage Sizer
│   ├── PricingTool.tsx   # Kernlogik & UI für den Listpreisrechner (mit LocalStorage)
│   └── DiscountTool.tsx  # Kernlogik & UI für den Rabattsatzrechner
├── lib/                  # Hilfsfunktionen & Konfigurationen
│   ├── auth.ts           # Token-basierte Rollenverifizierung (JWT/Jose-basiert im Cookie)
│   └── roles.tsx         # Konfiguration der Rollen und Symbole
└── public/               # Statische Ressourcen (Icons, PWA Manifest)
```

---

## ⚙️ Installation & Lokale Ausführung

### Voraussetzungen
Stellen Sie sicher, dass **Node.js** (v18 oder neuer) und **npm** auf Ihrem System installiert sind.

### 1. Abhängigkeiten installieren
Führen Sie im Projektverzeichnis folgenden Befehl aus:
```bash
npm install
```

### 2. Entwicklungsserver starten
Starten Sie den lokalen Webserver mit:
```bash
npm run dev
```
Die Anwendung ist anschließend unter [http://localhost:3000](http://localhost:3000) erreichbar.

### 3. Production Build erstellen
Um die Anwendung für den Produktiveinsatz zu optimieren und zu bauen:
```bash
npm run build
npm start
```
