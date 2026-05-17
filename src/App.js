import { useState, useRef, useEffect } from "react";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

const emojiList = ["🐶","🐱","🐰","🐹","🐻","🐼","🐨","🦊","🐯","🦁","🐮","🐷","🐸","🐵","🦜","🐠","🐢","🦎"];

// 登入/註冊頁面
function AuthPage({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (e) {
      if (e.code === "auth/user-not-found") setError("找不到這個帳號");
      else if (e.code === "auth/wrong-password") setError("密碼錯誤");
      else if (e.code === "auth/email-already-in-use") setError("這個 Email 已被註冊");
      else if (e.code === "auth/weak-password") setError("密碼至少需要 6 個字元");
      else if (e.code === "auth/invalid-email") setError("Email 格式不正確");
      else setError("發生錯誤，請再試一次");
    }
    setLoading(false);
  }

  return (
    <div style={{ background: "#f7f3ef", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "white", borderRadius: 20, padding: 32, width: "100%", maxWidth: 400, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
        <h1 style={{ textAlign: "center", color: "#D85A30", marginBottom: 8, fontSize: 32 }}>🐾 PawBook</h1>
        <p style={{ textAlign: "center", color: "#999", marginBottom: 28, fontSize: 14 }}>寵物的社群媒體</p>

        <div style={{ display: "flex", background: "#f5f5f5", borderRadius: 10, padding: 4, marginBottom: 24 }}>
          <button onClick={() => setIsLogin(true)}
            style={{ flex: 1, padding: "8px 0", border: "none", borderRadius: 8, background: isLogin ? "white" : "transparent", fontWeight: isLogin ? 600 : 400, cursor: "pointer", fontSize: 14, boxShadow: isLogin ? "0 1px 4px rgba(0,0,0,0.1)" : "none" }}>
            登入
          </button>
          <button onClick={() => setIsLogin(false)}
            style={{ flex: 1, padding: "8px 0", border: "none", borderRadius: 8, background: !isLogin ? "white" : "transparent", fontWeight: !isLogin ? 600 : 400, cursor: "pointer", fontSize: 14, boxShadow: !isLogin ? "0 1px 4px rgba(0,0,0,0.1)" : "none" }}>
            註冊
          </button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email"
            style={{ width: "100%", border: "1px solid #eee", borderRadius: 10, padding: "12px 14px", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>密碼</label>
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="至少 6 個字元" type="password"
            style={{ width: "100%", border: "1px solid #eee", borderRadius: 10, padding: "12px 14px", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
        </div>

        {error && <div style={{ color: "#e53e3e", fontSize: 13, marginBottom: 16, textAlign: "center" }}>{error}</div>}

        <button onClick={handleSubmit} disabled={loading}
          style={{ width: "100%", background: "#D85A30", color: "white", border: "none", borderRadius: 999, padding: "14px 0", fontSize: 16, fontWeight: 600, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
          {loading ? "處理中..." : isLogin ? "登入" : "註冊"}
        </button>
      </div>
    </div>
  );
}

// 建立寵物檔案
function SetupPage({ user, onSave }) {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [gender, setGender] = useState("男生");
  const [emoji, setEmoji] = useState("🐶");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!name.trim() || !species.trim()) return alert("請填寫名字和物種！");
    setLoading(true);
    const petData = { name, species, gender, emoji, ownerId: user.uid, ownerEmail: user.email };
    onSave(petData);
    setLoading(false);
  }

  return (
    <div style={{ background: "#f7f3ef", minHeight: "100vh", padding: 20 }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", color: "#D85A30", marginBottom: 8, fontSize: 28 }}>🐾 PawBook</h1>
        <p style={{ textAlign: "center", color: "#999", marginBottom: 24 }}>幫你的寵物建立檔案！</p>
        <div style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <div style={{ textAlign: "center", fontSize: 72, marginBottom: 16 }}>{emoji}</div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>選擇大頭貼</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {emojiList.map(e => (
                <button key={e} onClick={() => setEmoji(e)}
                  style={{ fontSize: 24, background: emoji === e ? "#FAECE7" : "#f5f5f5", border: emoji === e ? "2px solid #D85A30" : "2px solid transparent", borderRadius: 10, width: 44, height: 44, cursor: "pointer" }}>
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>寵物名字</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="例如：旺財、咪咪"
              style={{ width: "100%", border: "1px solid #eee", borderRadius: 10, padding: "10px 14px", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>物種 / 品種</label>
            <input value={species} onChange={e => setSpecies(e.target.value)} placeholder="例如：柴犬、布偶貓"
              style={{ width: "100%", border: "1px solid #eee", borderRadius: 10, padding: "10px 14px", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>性別</label>
            <div style={{ display: "flex", gap: 12 }}>
              {["男生", "女生"].map(g => (
                <button key={g} onClick={() => setGender(g)}
                  style={{ flex: 1, padding: "10px 0", border: gender === g ? "2px solid #D85A30" : "2px solid #eee", borderRadius: 10, background: gender === g ? "#FAECE7" : "white", color: gender === g ? "#D85A30" : "#666", fontWeight: gender === g ? 600 : 400, cursor: "pointer", fontSize: 15 }}>
                  {g === "男生" ? "♂ 男生" : "♀ 女生"}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleSave} disabled={loading}
            style={{ width: "100%", background: "#D85A30", color: "white", border: "none", borderRadius: 999, padding: "14px 0", fontSize: 16, fontWeight: 600, cursor: "pointer" }}>
            {loading ? "建立中..." : "建立寵物檔案 🐾"}
          </button>
        </div>
      </div>
    </div>
  );
}

// 貼文卡片
function PostCard({ post, currentUser, onLike }) {
  const liked = post.likes?.includes(currentUser?.uid);
  return (
    <div style={{ background: "white", borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{ fontSize: 40 }}>{post.emoji}</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 16 }}>{post.petName}</div>
          <div style={{ color: "#999", fontSize: 13 }}>{post.species} · {post.gender} · {post.time}</div>
        </div>
      </div>
      <div style={{ fontSize: 15, marginBottom: 16, lineHeight: 1.6 }}>{post.content}</div>
      <button onClick={() => onLike(post)}
        style={{ background: liked ? "#ff6b6b" : "#f5f5f5", color: liked ? "white" : "#666", border: "none", borderRadius: 999, padding: "8px 20px", cursor: "pointer", fontWeight: 500, fontSize: 14 }}>
        {liked ? "❤️" : "🤍"} {post.likes?.length || 0}
      </button>
    </div>
  );
}

// 主頁面
function HomePage({ user, pet }) {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setPosts(snap.docs.map(d => ({ id: d.id, ...d.data(), time: "剛剛" })));
  }

  async function handlePost() {
    if (!text.trim()) return;
    setLoading(true);
    await addDoc(collection(db, "posts"), {
      petName: pet.name,
      species: pet.species,
      gender: pet.gender,
      emoji: pet.emoji,
      ownerId: user.uid,
      content: text,
      likes: [],
      createdAt: new Date(),
    });
    setText("");
    await loadPosts();
    setLoading(false);
  }

  async function handleLike(post) {
    const ref = doc(db, "posts", post.id);
    const liked = post.likes?.includes(user.uid);
    await updateDoc(ref, {
      likes: liked ? arrayRemove(user.uid) : arrayUnion(user.uid),
    });
    await loadPosts();
  }

  return (
    <div style={{ background: "#f7f3ef", minHeight: "100vh", padding: 20 }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h1 style={{ color: "#D85A30", fontSize: 28, margin: 0 }}>🐾 PawBook</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ background: "white", borderRadius: 999, padding: "6px 14px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", fontSize: 14, fontWeight: 600 }}>
              {pet.emoji} {pet.name}
            </div>
            <button onClick={() => signOut(auth)}
              style={{ background: "white", border: "none", borderRadius: 999, padding: "6px 14px", cursor: "pointer", fontSize: 13, color: "#999", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              登出
            </button>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 36 }}>{pet.emoji}</div>
            <textarea value={text} onChange={e => setText(e.target.value)}
              placeholder={`${pet.name}今天想說什麼？`} rows={3}
              style={{ flex: 1, border: "1px solid #eee", borderRadius: 12, padding: 12, fontSize: 14, resize: "none", outline: "none", fontFamily: "inherit" }} />
          </div>
          <div style={{ textAlign: "right" }}>
            <button onClick={handlePost} disabled={loading}
              style={{ background: "#D85A30", color: "white", border: "none", borderRadius: 999, padding: "10px 24px", cursor: "pointer", fontWeight: 600, fontSize: 14, opacity: loading ? 0.7 : 1 }}>
              {loading ? "發布中..." : "發布 🐾"}
            </button>
          </div>
        </div>

        {posts.map(post => (
          <PostCard key={post.id} post={post} currentUser={user} onLike={handleLike} />
        ))}
      </div>
    </div>
  );
}

// 主程式
export default function App() {
  const [user, setUser] = useState(null);
  const [pet, setPet] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
    });
    return unsub;
  }, []);

  if (checking) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontSize: 40 }}>🐾</div>
  );

  if (!user) return <AuthPage />;
  if (!pet) return <SetupPage user={user} onSave={setPet} />;
  return <HomePage user={user} pet={pet} />;
}