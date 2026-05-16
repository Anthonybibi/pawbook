import { useState } from "react";

const initialPosts = [
  { id: 1, petName: "旺財", species: "柴犬", emoji: "🐶", content: "今天去公園撿了一根超大的樹枝！", likes: 28, liked: false, time: "2小時前" },
  { id: 2, petName: "咪咪", species: "布偶貓", emoji: "🐱", content: "曬太陽是世界上最幸福的事 ☀️", likes: 51, liked: false, time: "4小時前" },
  { id: 3, petName: "棉花", species: "荷蘭侏儒兔", emoji: "🐰", content: "主人買菠菜了！今天是最幸福的兔兔 🥬", likes: 13, liked: false, time: "6小時前" },
];

const emojiList = ["🐶","🐱","🐰","🐹","🐻","🐼","🐨","🦊","🐯","🦁","🐮","🐷","🐸","🐵","🦜","🐠","🐢","🦎"];

function SetupPage({ onSave }) {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [emoji, setEmoji] = useState("🐶");

  function handleSave() {
    if (!name.trim() || !species.trim()) return alert("請填寫名字和物種！");
    onSave({ name, species, emoji });
  }

  return (
    <div style={{ background: "#f7f3ef", minHeight: "100vh", padding: 20 }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", color: "#D85A30", marginBottom: 8, fontSize: 28 }}>🐾 PawBook</h1>
        <p style={{ textAlign: "center", color: "#999", marginBottom: 24 }}>先幫你的寵物建立檔案！</p>
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
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>物種 / 品種</label>
            <input value={species} onChange={e => setSpecies(e.target.value)} placeholder="例如：柴犬、布偶貓"
              style={{ width: "100%", border: "1px solid #eee", borderRadius: 10, padding: "10px 14px", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
          </div>
          <button onClick={handleSave}
            style={{ width: "100%", background: "#D85A30", color: "white", border: "none", borderRadius: 999, padding: "14px 0", fontSize: 16, fontWeight: 600, cursor: "pointer" }}>
            建立寵物檔案 🐾
          </button>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post, onLike }) {
  return (
    <div style={{ background: "white", borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{ fontSize: 40 }}>{post.emoji}</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 16 }}>{post.petName}</div>
          <div style={{ color: "#999", fontSize: 13 }}>{post.species} · {post.time}</div>
        </div>
      </div>
      <div style={{ fontSize: 15, marginBottom: 16, lineHeight: 1.6 }}>{post.content}</div>
      <button onClick={() => onLike(post.id)}
        style={{ background: post.liked ? "#ff6b6b" : "#f5f5f5", color: post.liked ? "white" : "#666", border: "none", borderRadius: 999, padding: "8px 20px", cursor: "pointer", fontWeight: 500, fontSize: 14 }}>
        {post.liked ? "❤️" : "🤍"} {post.likes}
      </button>
    </div>
  );
}

function ComposeBox({ pet, onPost }) {
  const [text, setText] = useState("");

  function handlePost() {
    if (!text.trim()) return;
    onPost(text);
    setText("");
  }

  return (
    <div style={{ background: "white", borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 36 }}>{pet.emoji}</div>
        <textarea value={text} onChange={e => setText(e.target.value)}
          placeholder={pet.name + "今天想說什麼？"} rows={3}
          style={{ flex: 1, border: "1px solid #eee", borderRadius: 12, padding: 12, fontSize: 14, resize: "none", outline: "none", fontFamily: "inherit" }} />
      </div>
      <div style={{ textAlign: "right" }}>
        <button onClick={handlePost}
          style={{ background: "#D85A30", color: "white", border: "none", borderRadius: 999, padding: "10px 24px", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
          發布 🐾
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [pet, setPet] = useState(null);
  const [posts, setPosts] = useState(initialPosts);

  function handlePost(text) {
    const newPost = {
      id: Date.now(),
      petName: pet.name,
      species: pet.species,
      emoji: pet.emoji,
      content: text,
      likes: 0,
      liked: false,
      time: "剛剛",
    };
    setPosts([newPost, ...posts]);
  }

  function handleLike(id) {
    setPosts(posts.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  }

  if (!pet) return <SetupPage onSave={setPet} />;

  return (
    <div style={{ background: "#f7f3ef", minHeight: "100vh", padding: 20 }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h1 style={{ color: "#D85A30", fontSize: 28, margin: 0 }}>🐾 PawBook</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "white", borderRadius: 999, padding: "8px 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <span style={{ fontSize: 24 }}>{pet.emoji}</span>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{pet.name}</span>
          </div>
        </div>
        <ComposeBox pet={pet} onPost={handlePost} />
        {posts.map(post => (
          <PostCard key={post.id} post={post} onLike={handleLike} />
        ))}
      </div>
    </div>
  );
}