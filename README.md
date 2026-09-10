# KARAAMO Construction Company

React + Vite + Firebase website — dhulal la iibinayo, la codsan karo, iyo admin dashboard.

## Isticmaalka

```bash
npm install
npm run dev
```

Si aad u dhisto (build) production:

```bash
npm run build
```

## Firebase

Isku project-ka `one-click-onilne` ayaa la isticmaalayaa (`src/firebase.js`) — isla mid Rising Star School. Collections-ka cusub waxay leeyihiin prefix **karama** si aanay ula tartamin xogta apps-ka kale:

- `karamaAdmin` — admin-yada (`username`, `password`, `role`) — isticmaal collection-ka hore ee jira (username: `mohamed12`)
- `karamaLands` — dhulalka la soo bandhigay (`title`, `price`, `location`, `description`, `imageUrl`, `createdAt`)
- `karamaLandRequests` — codsadayaasha dhul gaar ah (`landId`, `landTitle`, `name`, `phone`, `location`, `status`, `createdAt`)
- `karamaRegistrations` — isdiiwaangelinta guud (`name`, `phone`, `location`, `message`, `createdAt`)
- `karamaContactMessages` — fariimaha Contact page-ka (`name`, `phone`, `message`, `createdAt`)

Sawirada dhulalka waxaa lagu kaydiyaa Firebase Storage `karama-lands/`.

**Muhiim:** Firestore/Storage rules-ka project-ka `one-click-onilne` waa inay ogolaadaan read/write collections-kan cusub (ma jiro Firebase Auth — sida Rising Star School, password-ka si toos ah ayaa Firestore-ka lagu hubiyaa).

## Boggagga

- `/` — Home (hero + dhulalka)
- `/about` — About
- `/contact` — Contact
- `/registration` — Registration guud
- `/admin` — Admin login (kuma jiro navbar-ka)
- `/admin/dashboard` — Admin dashboard (Add Land, Dhulalka, Codsadayaasha, Isdiiwaangelinno, Fariimaha)
