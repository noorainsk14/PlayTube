import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FaPlay,
  FaPause,
  FaForward,
  FaBackward,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaThumbsUp,
  FaThumbsDown,
  FaDownload,
  FaBookmark,
  FaComment,
} from "react-icons/fa";
import Description from "../../components/Description";
import IconButton from "../../components/IconButton";

const Shorts = () => {
  const { shortData } = useSelector((state) => state.content);
  const { userData } = useSelector((state) => state.user);
  const [shortList, setShortList] = useState([]);
  const shortRef = useRef([]);
  const [playIndex, setPlayIndex] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const index = Number(entry.target.dataset.index);
        const video = shortRef.current[index];

        if (video) {
          if (entry.isIntersecting) {
            (video.muted = false), video.play();
          } else {
            video.muted = true;
            video.pause();
          }
        }
      });
    });

    shortRef.current.forEach((video) => {
      if (video) {
        observer.observe(video);
      }

      return () => observer.disconnect();
    });
  }, [shortList]);

  const togglePlay = (index) => {
    const video = shortRef.current[index];

    if (video) {
      if (video.paused) {
        video.play();
        setPlayIndex(null);
      } else {
        video.pause();
        setPlayIndex(index);
      }
    }
  };

  useEffect(() => {
    if (!shortData || shortData.length === 0) {
      return;
    }

    const shuffled = [...shortData].sort(() => Math.random() - 0.5);
    setShortList(shuffled);
    //console.log(shuffled);
  }, [shortData]);

  return (
    <div className="h-[100vh] w-full overflow-y-scroll snap-y snap-mandatory">
      {shortList?.map((short, index) => (
        <div
          key={short?.id}
          className="min-h-screen w-full flex md:items-center items-start justify-center snap-start pt-[40px] md:pt-0"
        >
          <div
            className="relative w-[420px] md:w-[350px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-xl  border border-gray-700 cursor-pointer"
            onClick={() => {
              togglePlay(index);
            }}
          >
            <video
              autoPlay
              src={short?.shortUrl}
              ref={(el) => (shortRef.current[index] = el)}
              data-index={index}
              className="w-full h-full object-cover"
              loop
              playsInline
            />
            {playIndex === index && (
              <div className="absolute top-3 right-3 bg-black/60 rounded-full p-2">
                <FaPlay className="text-white text-lg" />
              </div>
            )}
            {playIndex !== index && (
              <div className="absolute top-3 right-3 bg-black/60 rounded-full p-2">
                <FaPause className="text-white text-lg" />
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white space-y-1">
              <div className="flex items-center justify-start gap-2">
                <img
                  src={short?.channel?.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border-1 border-gray-700 "
                />
                <span className="text-sm text-gray-300">
                  @{short?.channel?.name.toLowerCase()}
                </span>
                <button className="bg-white text-black text-xs px-[10px] py-[10px] rounded-full cursor-pointer">
                  Subscribe
                </button>
              </div>
              <div className="flex items-center justify-start">
                <h3 className="font-bold text-lg line-clamp-2">
                  {short?.title}
                </h3>
              </div>
              <div>
                {short?.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div>
                <Description text={short?.description} />
              </div>

              <div className="absolute right-3 bottom-28 flex flex-col items-center gap-5 text-white">
                <IconButton
                  icon={FaThumbsUp}
                  label={"Likes"}
                  active={short?.likes?.includes(userData._id)}
                  count={short?.likes?.length}
                />
                <IconButton
                  icon={FaThumbsDown}
                  label={"Dislikes"}
                  active={short?.disLikes?.includes(userData._id)}
                  count={short?.disLikes?.length}
                />
                <IconButton icon={FaComment} label={"Comment"} />
                <IconButton
                  icon={FaDownload}
                  label={"Download"}
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = short?.shortUrl;
                    link.download = `${short?.title}.mp4`;
                    link.click();
                  }}
                />

                <IconButton
                  icon={FaBookmark}
                  label={"Save"}
                  active={short?.savedBy?.includes(userData._id)}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Shorts;
