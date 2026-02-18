# CourseReview ETH

If you wanna see the forum in action: https://coursereview.ch

This is the frontend of CourseReview. A forum to rate and review all courses in ETHZ.  
It works with SwitchAAI used from n.ethz website to verify users.  
Reviews will need to be approved before being released and the UniqueId will be saved with the review. Such that users are be able to edit them later on.
The uniqueId is different per university, for ETH it is: "string-of-numbers@ethz.ch"  
Nothing else is saved to still somewhat have anonymity as you cannot (easily) get the UniqueId of a Student.


## To run it locally
Set env variables in `.env` file.
```
npm i
npm run dev
```
