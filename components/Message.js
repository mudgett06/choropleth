export default function Message(props) {
  return (
    <span style={props.success ? { color: "green" } : { color: "red" }}>
      {props.text}
    </span>
  );
}
