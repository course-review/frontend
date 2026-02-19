# CourseReview ETH

If you wanna see the forum in action: https://coursereview.ch

This is the frontend of CourseReview. A forum to rate and review all courses in ETHZ.  
It works with SwitchAAI used from n.ethz website to verify users.  
Reviews will need to be approved before being released and the UniqueId will be saved with the review. Such that users are be able to edit them later on.
The uniqueId is different per university, for ETH it is: "string-of-numbers@ethz.ch"  
Nothing else is saved to still somewhat have anonymity as you cannot (easily) get the UniqueId of a Student.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

