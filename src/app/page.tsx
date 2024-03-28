import { ClientComponent } from "./client-component";
import { ServerComponent } from "./server-component";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="space-y-0 gap-0 flex mt-14 ml-4 z-10 md:ml-10 self-start m-auto">
        <span className="rotate-45 inline-block w-20 h-30 md:h-24 md:text-6xl text-5xl text-primary">
          &lt;-
        </span>
        <h1 className="z-10 text-left bg-gradient-to-br from-primary to-primary py-4 bg-clip-text text-4xl font-medium tracking-tighter text-transparent md:text-7xl">
          The toolbar <br /> nobody asked <br /> for
        </h1>
      </div>
      <div className="bg-amber-100 w-full h-36 flex flex-col sm:flex-row justify-evenly items-center mb-auto">
        <ClientComponent />
        <ServerComponent />
      </div>
    </main>
  );
}
