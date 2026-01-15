import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  setDoc,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BlogPost } from "@/domain/blog";

const COLLECTION = "posts";

const convertDate = (date: Date | Timestamp): Date => {
  return date instanceof Timestamp ? date.toDate() : date;
};

const mapDocToPost = (doc: QueryDocumentSnapshot<DocumentData>): BlogPost => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    content: data.content,
    excerpt: data.excerpt,
    coverImage: data.coverImage,
    author: data.author,
    tags: data.tags,
    published: data.published,
    createdAt: convertDate(data.createdAt),
    updatedAt: convertDate(data.updatedAt)
  };
};

export const BlogRepository = {
  // Get all published posts (ordered by date)
  async getPosts(): Promise<BlogPost[]> {
    const q = query(
      collection(db, COLLECTION),
      where("published", "==", true),
      orderBy("createdAt", "desc")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDocToPost);
  },

  // Get a single post by slug
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const docRef = doc(db, COLLECTION, slug);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        coverImage: data.coverImage,
        author: data.author,
        tags: data.tags,
        published: data.published,
        createdAt: convertDate(data.createdAt),
        updatedAt: convertDate(data.updatedAt)
      };
    }
    
    return null;
  },

  // For seeding data
  async savePost(post: BlogPost): Promise<void> {
    await setDoc(doc(db, COLLECTION, post.id), {
      ...post,
      updatedAt: new Date()
    }, { merge: true });
  }
};
