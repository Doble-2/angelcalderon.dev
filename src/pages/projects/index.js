import { app } from "../../firebase/server";
import { getFirestore } from "firebase-admin/firestore";

export const POST = async ({ request, redirect }) => {
    const body = new URLSearchParams(await request.text());
    const name = body.get("name");
  try {
    const db = getFirestore(app);
    const friendsRef = db.collection("projects");
    const docRef = await friendsRef.add({
      name,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    return new Response("Something went wrong", {
      status: 500,
    });
  }
  return redirect("/");
};