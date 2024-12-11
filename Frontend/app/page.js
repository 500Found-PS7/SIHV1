import Content from "./component/Content";
import { Navigation } from "./component/Navigation";

export default function Home() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-neutral-950">
        <Content />
      </div>
    </>
  );
}
