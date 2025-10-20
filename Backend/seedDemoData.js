// seedDemoData.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/user.model.js";
import { Channel } from "./models/channel.model.js";
import { Video } from "./models/video.model.js";
import { Short } from "./models/short.model.js";
import { Playlist } from "./models/playlist.model.js";
import { Post } from "./models/post.model.js";

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI ;

const demoAvatars = [
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/45.jpg",
  "https://randomuser.me/api/portraits/men/14.jpg",
  "https://randomuser.me/api/portraits/women/24.jpg",
  "https://randomuser.me/api/portraits/men/5.jpg",
  "https://randomuser.me/api/portraits/women/8.jpg",
  "https://randomuser.me/api/portraits/men/9.jpg",
  "https://randomuser.me/api/portraits/women/12.jpg",
  "https://randomuser.me/api/portraits/men/28.jpg",
  "https://randomuser.me/api/portraits/women/33.jpg",
];

const demoThumbnails = [
  "https://picsum.photos/seed/thumb1/640/360",
  "https://picsum.photos/seed/thumb2/640/360",
  "https://picsum.photos/seed/thumb3/640/360",
  "https://picsum.photos/seed/thumb4/640/360",
  "https://picsum.photos/seed/thumb5/640/360",
  "https://picsum.photos/seed/thumb6/640/360",
  "https://picsum.photos/seed/thumb7/640/360",
  "https://picsum.photos/seed/thumb8/640/360",
  "https://picsum.photos/seed/thumb9/640/360",
  "https://picsum.photos/seed/thumb10/640/360",
];

// Public sample MP4 links (these include audio). They are generic sample files and safe for demos.
const demoVideoUrls = [
  // samplelib / sample-videos style short/long mp4s with audio
  "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-20s.mp4",
  // Big Buck Bunny hosted short variants (public)
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_5s_1MB.mp4",
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_2MB.mp4",
  // additional sample videos
  "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
  "https://sample-videos.com/video123/mp4/480/asdasdas.mp4", // note: fallback sample link
  "https://samplelib.com/lib/preview/mp4/sample-3s.mp4"
];

// shorter files for "shorts" (3-10s)
const demoShortUrls = [
  "https://samplelib.com/lib/preview/mp4/sample-3s.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_5s_1MB.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
  "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
];

const categories = ["Technology", "Food", "Travel", "Music", "Education", "Lifestyle", "Gaming", "Comedy", "Science", "Art"];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function main() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ MongoDB connected");

    // ----- WARNING: delete existing demo data (you asked to wipe current DB) -----
    // This will remove ALL documents from these collections.
    await Promise.all([
      User.deleteMany({}),
      Channel.deleteMany({}),
      Video.deleteMany({}),
      Short.deleteMany({}),
      Playlist.deleteMany({}),
      Post.deleteMany({}),
    ]);
    console.log("🧹 All collections cleared");

    // ---- create demo users ----
    const usersData = [];
    for (let i = 0; i < 10; i++) {
      usersData.push({
        username: `demo_user${i + 1}`,
        email: `demo_user${i + 1}@demo.com`,
        password: "password123", // will be hashed by your pre-save if present
        fullName: `Demo User ${i + 1}`,
        avatar: demoAvatars[i % demoAvatars.length],
      });
    }
    const users = await User.insertMany(usersData);
    console.log("👥 Created users:", users.length);

    // ---- create channels (one per user) ----
    const channels = [];
    for (let i = 0; i < users.length; i++) {
      const ch = await Channel.create({
        owner: users[i]._id,
        name: `${users[i].username}'s Channel`,
        description: `Welcome to ${users[i].fullName}'s demo channel.`,
        category: rand(categories),
        coverImage: rand(demoThumbnails),
        avatar: users[i].avatar,
      });
      channels.push(ch);

      // attach channel ref into user.channel if your model uses it
      users[i].channel = ch._id;
      await users[i].save();
    }
    console.log("📺 Created channels:", channels.length);

    // ---- create videos (20) ----
    const videos = [];
    for (let i = 0; i < 20; i++) {
      const channel = rand(channels);
      const video = await Video.create({
        channel: channel._id,
        title: `Demo Video ${i + 1} — ${channel.name}`,
        description: `This is a demo video #${i + 1} for ${channel.name}.`,
        videoUrl: rand(demoVideoUrls),
        thumbnail: rand(demoThumbnails),
        tags: ["demo", "portfolio", channel.name.split("'")[0].toLowerCase()],
        views: Math.floor(Math.random() * 20000),
        likes: [],
        disLikes: [],
        savedBy: [],
      });
      videos.push(video);

      // push to channel.videos
      channel.videos = channel.videos || [];
      channel.videos.push(video._id);
      await channel.save();
    }
    console.log("🎥 Created videos:", videos.length);

    // ---- create shorts (15) ----
    const shorts = [];
    for (let i = 0; i < 15; i++) {
      const channel = rand(channels);
      const sh = await Short.create({
        channel: channel._id,
        title: `Demo Short ${i + 1} — ${channel.name}`,
        description: `Short demo #${i + 1}`,
        shortUrl: rand(demoShortUrls),
        tags: ["demo", "short"],
        views: Math.floor(Math.random() * 15000),
        likes: [],
        disLikes: [],
        savedBy: [],
      });
      shorts.push(sh);

      channel.shorts = channel.shorts || [];
      channel.shorts.push(sh._id);
      await channel.save();
    }
    console.log("🎬 Created shorts:", shorts.length);

    // ---- create playlists (10) ----
    const playlists = [];
    for (let i = 0; i < 10; i++) {
      const channel = rand(channels);
      // pick 3 random videos
      const pick = videos.sort(() => 0.5 - Math.random()).slice(0, 3).map((v) => v._id);
      const pl = await Playlist.create({
        channel: channel._id,
        title: `${channel.name} Playlist ${i + 1}`,
        description: `Demo playlist ${i + 1}`,
        videos: pick,
        savedBy: [],
      });
      playlists.push(pl);
      channel.playlist = channel.playlist || [];
      channel.playlist.push(pl._id);
      await channel.save();
    }
    console.log("📚 Created playlists:", playlists.length);

    // ---- create posts (community) (10) ----
    const posts = [];
    for (let i = 0; i < 10; i++) {
      const channel = rand(channels);
      const p = await Post.create({
        channel: channel._id,
        content: `Demo post ${i + 1} from ${channel.name}.`,
        image: rand(demoThumbnails),
        likes: [],
        comments: [],
      });
      posts.push(p);
      channel.communityPost = channel.communityPost || [];
      channel.communityPost.push(p._id);
      await channel.save();
    }
    console.log("📝 Created posts:", posts.length);

    console.log("✅ Demo seed complete!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

main();
