import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Content = () => {
  const { channelData } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("Videos");
  const navigate = useNavigate();

  return (
    <div className="text-white min-h-screen pt-5 px-4 sm:px-6 mb-16">
      <div className="flex flex-wrap gap-6 border-b border-gray-800 mb-6">
        {["Videos", "Shorts", "Playlists", "Community"].map((tab) => (
          <button
            key={tab}
            className={`pb-3 relative font-medium transition ${
              activeTab === tab
                ? "text-white"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}{" "}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-orange-600 rounded-full"></span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {/* for videos  */}
        {activeTab === "Videos" && (
          <div>
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full border border-gray-700 rounded-lg">
                <thead className="bg-gray-800 text-sm">
                  <tr>
                    <th className="p-3 text-left">Thumbnail</th>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Views</th>
                    <th className="p-3 text-left">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {channelData?.videos?.map((v) => (
                    <tr
                      key={v?._id}
                      className="border-t border-gray-700 hover:bg-gray-800/40"
                    >
                      <td className="p-3">
                        <img
                          src={v?.thumbnail}
                          alt="thumbnail"
                          className="w-20 h-12 rounded object-cover"
                        />
                      </td>
                      <td className="p-3 text-start">{v?.title}</td>
                      <td className="p-3 text-start">{v?.views}</td>
                      <td className="p-3 ">
                        <FaEdit
                          onClick={() => {
                            navigate(`/PT-studio/update-video/${v._id}`);
                          }}
                          className="cursor-pointer hover:text-orange-400"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 md:hidden">
              {channelData?.videos?.map((v) => (
                <div className=" bg-[#1c1c1c] rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col">
                  <img
                    src={v.thumbnail}
                    alt="thumbnail"
                    className="w-full h-40 object-cover"
                  />

                  <div className="flex-1 p-4">
                    <h3 className="text-base font-semibold">{v?.title}</h3>
                  </div>
                  <div className="flex px-4 py-3 border-t border-gray-700 items-center justify-between text-sm text-gray-400">
                    <span>{v?.views}</span>
                    <FaEdit
                      className="cursor-pointer hover:text-orange-400"
                      onClick={() => {
                        navigate(`/PT-studio/update-video/${v._id}`);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* for shorts  */}
        {activeTab === "Shorts" && (
          <div>
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full border border-gray-700 rounded-lg">
                <thead className="bg-gray-800 text-sm">
                  <tr>
                    <th className="p-3 text-left">Preview</th>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Views</th>
                    <th className="p-3 text-left">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {channelData?.shorts?.map((s) => (
                    <tr
                      key={s?._id}
                      className="border-t border-gray-700 hover:bg-gray-800/40"
                    >
                      <td className="p-3">
                        <video
                          src={s?.shortUrl}
                          className="w-16 h-24 bg-black rounded"
                          muted
                          playsInline
                        />
                      </td>
                      <td className="p-3 text-start">{s?.title}</td>
                      <td className="p-3 text-start">{s?.views}</td>
                      <td className="p-3 ">
                        <FaEdit
                          onClick={() => {
                            navigate(`/PT-studio/update-short/${s._id}`);
                          }}
                          className="cursor-pointer hover:text-orange-400"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 md:hidden">
              {channelData?.shorts?.map((s) => (
                <div className=" bg-[#1c1c1c] rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col border">
                  <video
                    src={s?.shortUrl}
                    className="w-full aspect-[9/16] object-cover"
                    playsInline
                    muted
                    controls
                  />

                  <div className="flex-1 p-4">
                    <h3 className="text-base font-semibold">{s?.title}</h3>
                  </div>
                  <div className="flex px-4 py-3 border-t border-gray-700 items-center justify-between text-sm text-gray-400">
                    <span>{s?.views}</span>
                    <FaEdit
                      onClick={() => {
                        navigate(`/PT-studio/update-short/${s._id}`);
                      }}
                      className="cursor-pointer hover:text-orange-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* for playlist  */}
        {activeTab === "Playlists" && (
          <div>
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full border border-gray-700 rounded-lg">
                <thead className="bg-gray-800 text-sm">
                  <tr>
                    <th className="p-3 text-left">Preview</th>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Total Videos</th>
                    <th className="p-3 text-left">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {channelData?.playlist?.map((s) => (
                    <tr
                      key={s?._id}
                      className="border-t border-gray-700 hover:bg-gray-800/40 h-50"
                    >
                      <td className="p-3">
                        {s?.videos[0]?.thumbnail && (
                          <img
                            src={s?.videos[0]?.thumbnail}
                            alt="thumbnail"
                            className="w-full h-40 object-cover"
                          />
                        )}
                      </td>
                      <td className="p-3 text-start">{s?.title}</td>
                      <td className="p-3 text-start">{s?.videos?.length}</td>
                      <td className="p-3 ">
                        <FaEdit
                          onClick={() => {
                            navigate(`/PT-studio/update-video/${v._id}`);
                          }}
                          className="cursor-pointer hover:text-orange-400"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 md:hidden">
              {channelData?.playlist?.map((s) => (
                <div className=" bg-[#1c1c1c] rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col border">
                  {s?.videos[0]?.thumbnail && (
                    <img
                      src={s?.videos[0]?.thumbnail}
                      alt="thumbnail"
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="flex-1 p-4">
                    <h3 className="text-base font-semibold">{s?.title}</h3>
                  </div>
                  <div className="flex px-4 py-3 border-t border-gray-700 items-center justify-between text-sm text-gray-400">
                    <span>{s?.videos?.length}</span>
                    <FaEdit className="cursor-pointer hover:text-orange-400" />
                    <FaEdit
                      onClick={() => {
                        navigate(`/PT-studio/update-video/${v._id}`);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* for community  */}
        {activeTab === "Community" && (
          <div>
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full border border-gray-700 rounded-lg">
                <thead className="bg-gray-800 text-sm">
                  <tr>
                    <th className="p-3 text-left">Image</th>
                    <th className="p-3 text-left">Post</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {channelData?.communityPost?.map((s) => (
                    <tr
                      key={s?._id}
                      className="border-t border-gray-700 hover:bg-gray-800/40"
                    >
                      <td className="p-3 w-50 h-50">
                        {s?.image !== null && (
                          <img
                            src={s?.image}
                            alt="Image"
                            className="w-50 h-50 object-cover"
                          />
                        )}
                      </td>
                      <td className="p-3 text-start">{s?.content}</td>
                      <td className="p-3 text-start">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 ">
                        <MdDelete
                          className="cursor-pointer hover:text-orange-400"
                          size={20}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 lg:hidden">
              {channelData?.communityPost?.map((s) => (
                <div className=" bg-[#1c1c1c] rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col border">
                  {s?.image !== null && (
                    <img
                      src={s?.image}
                      alt="Image"
                      className="w-full h-70 object-cover"
                    />
                  )}

                  <div className="flex-1 p-4">
                    <h3 className="text-base font-semibold">{s?.content}</h3>
                  </div>
                  <div className="flex px-4 py-3 border-t border-gray-700 items-center justify-between text-sm text-gray-400">
                    <span>{new Date(s.createdAt).toLocaleDateString()}</span>
                    <MdDelete
                      size={20}
                      className="cursor-pointer hover:text-orange-400"
                    />
                    {/* <FaEdit onClick={()=>{navigate(`/PT-studio/manage-video/${v._id}`)}}/> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Content;
