import Dashboard from "./components/Dashboard";

export default function Home() {  

  const latitude = "22.6883834";
  const longitude = "75.8284917";

  return (
    <div className="min-h-screen bg-background">
      <Dashboard latitude={latitude} longitude={longitude}/>
    </div>
  );
}
