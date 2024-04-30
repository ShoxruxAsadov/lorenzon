import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Rodal from "rodal";
import axios from "axios";

import { success, wrong } from "../../../utils/toastify";
import GetAudioDuration from "../../../hooks/useDuration";
import AdminLayout from "../../../layouts/admin";

import { IoTimeOutline } from "react-icons/io5";
import { HiSearch } from "react-icons/hi";

export default function AdminSongs() {
  const [allSongs, setAllSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [songDeleted, setSongDeleted] = useState({})
  const [rodalDelete, setRodalDelete] = useState(false)
  const router = useRouter()

  useEffect(() => {
    getSongs()
  }, [])

  const getSongs = () => axios.get(`${process.env.NEXT_PUBLIC_SERVER_API}/songs`, { headers: { 'secret': process.env.NEXT_PUBLIC_SECRET } }).then(({ data }) => setAllSongs(data)).finally(() => setLoading(false))
  const removeSong = () => axios.delete(`${process.env.NEXT_PUBLIC_SERVER_API}/songs/${songDeleted._id}`).then(() => success("Deleted song")).catch(() => wrong("Error")).finally(() => { setRodalDelete(false); getSongs() })

  return (
    <AdminLayout page="admin-musics" title="Musics">
      <header>
        <div className="category">
          <h1>Songs</h1>
        </div>
        <div className="others">
          <div className="search">
            <input
              type='text'
              placeholder='Search songs here...'
            />
            <HiSearch />
          </div>
          <div className="addUser">
            <button onClick={() => router.push("/admin/songs/add")}>
              Add song
            </button>
          </div>
        </div>
      </header>
      <div className="content">
        <div className="table">
          <table>
            <thead className="thead">
              <tr className="tr">
                <th className="th">Song</th>
                <th className="th">Listen</th>
                <th className="th"><IoTimeOutline /></th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="tbody">
              {allSongs.map((song, i) => (
                <tr className="tr" key={i} >
                  <td className="td">
                    <img src={song.image} alt={song.name} onClick={()=>router.push(`/album/${song.album}`)}/>
                    <div className="name">
                      <h1 onClick={()=>router.push(`/album/${song.album}`)}>{song.name}</h1>
                      <p>{song.singerName.map((n,i) => <span key={i} onClick={() => router.push(`/@${song.singerUsername[i]}`)}>{n + ", "}</span>)}</p>
                    </div>
                  </td>
                  <td className="td">{song.listenCount}</td>
                  <td className="td"><GetAudioDuration audioUrl={song.song} /></td>
                  <td><button onClick={() => { setRodalDelete(true); setSongDeleted(song) }}>Delete</button></td>
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
        <h1>Delete it <span>{songDeleted.name}</span> ?</h1>
        <div className="sure">
          <p>Are you sure you want to delete this song?</p>
          <button onClick={removeSong}>delete</button>
        </div>
      </Rodal>
    </AdminLayout>
  );
}
