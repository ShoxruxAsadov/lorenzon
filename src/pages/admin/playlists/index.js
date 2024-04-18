import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Rodal from "rodal";
import axios from "axios";

import { success, wrong } from "../../../utils/toastify";
import GetAudioDuration from "../../../hooks/useDuration";
import AdminLayout from "../../../layouts/admin";

import { IoTimeOutline } from "react-icons/io5";
import { HiSearch } from "react-icons/hi";

export default function AdminPlaylists() {
  const [allPlaylists, setAllPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [playlistDeleted, setPlaylistDeleted] = useState({})
  const [rodalDelete, setRodalDelete] = useState(false)
  const router = useRouter()

  useEffect(() => {
    getPlaylists()
  }, [])

  const getPlaylists = () => axios.get(`${process.env.NEXT_PUBLIC_SERVER_API}/playlists`).then(({ data }) => setAllPlaylists(data)).finally(() => setLoading(false))
  const removePlaylist = () => axios.delete(`${process.env.NEXT_PUBLIC_SERVER_API}/playlists/${playlistDeleted._id}`).then(() => success("Deleted song")).catch(() => wrong("Error")).finally(() => { setRodalDelete(false); getPlaylists() })

  return (
    <AdminLayout page="admin-musics" title="Musics">
      <header>
        <div className="category">
          <h1>Playlists</h1>
        </div>
        <div className="others">
          <div className="search">
            <input
              type='text'
              placeholder='Search playlists here...'
            />
            <HiSearch />
          </div>
        </div>
      </header>
      <div className="content">
        <div className="table">
          <table>
            <thead className="thead">
              <tr className="tr">
                <th className="th">Playlist</th>
                <th className="th">Songs</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="tbody">
              {allPlaylists.map((playlist, i) => (
                <tr className="tr" key={i} >
                  <td className="td">
                    <img src={playlist.image} alt={playlist.name} onClick={() => router.push(`/playlist/${playlist._id}`)} />
                    <div className="name">
                      <h1 onClick={() => router.push(`/playlist/${playlist._id}`)}>{playlist.name}</h1>
                      <p onClick={() => router.push(`/@${playlist.creator.username}`)}>{playlist.creator.name}</p>
                    </div>
                  </td>
                  <td className="td">{playlist.songs.length}</td>
                  <td><button onClick={() => { setRodalDelete(true); setPlaylistDeleted(song) }}>Delete</button></td>
                </tr>
              ))}
              {loading && <tr className="loadingTable">
                <td rowSpan={3} colSpan={7}>
                  <div className="waiting">
                    <span className="loader"></span>
                  </div>
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
      <Rodal className="rodal-delete" visible={rodalDelete} onClose={() => setRodalDelete(false)}>
        <h1>Delete it <span>{playlistDeleted.name}</span> ?</h1>
        <div className="sure">
          <p>Are you sure you want to delete this song?</p>
          <button onClick={removePlaylist}>delete</button>
        </div>
      </Rodal>
    </AdminLayout>
  );
}