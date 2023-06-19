const NowPlaying = () => {
  return (
    <div className="now-playing">
      <div className="cover-art"></div>

      <div className="track">
        <div className="title">
          <a href="#">Song Title</a>
        </div>
        <div className="album">
          <a href="#">Album name</a> (<a href="#">2023</a>)
        </div>
        <div className="artist">
          <a href="#">Artist name</a>
        </div>
      </div>
    </div>
  );
};

export { NowPlaying };
