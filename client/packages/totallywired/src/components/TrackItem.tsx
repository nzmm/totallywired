const TrackItem = (props: { label: string }) => {
  return <div className="track">{`track > ${props.label}`}</div>;
};

export { TrackItem };
