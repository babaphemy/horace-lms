import Image from "next/image"

interface OutcomeProof {
  imageUrl: string
  altText: string
  title: string
  detail: string
}

const proofs: OutcomeProof[] = [
  {
    imageUrl: "/img/1.webp",
    altText: "Robotics workcell project preview",
    title: "Robotics workcell",
    detail:
      "Learner builds a sensor-driven sorting flow and submits test notes.",
  },
  {
    imageUrl: "/img/2.webp",
    altText: "AI assistant project preview",
    title: "AI assistant prototype",
    detail: "Learner ships a support triage assistant with evaluation results.",
  },
  {
    imageUrl: "/img/3.webp",
    altText: "Game prototype project preview",
    title: "Playable game prototype",
    detail:
      "Learner publishes a browser game with checkpoints and source link.",
  },
  {
    imageUrl: "/img/4.webp",
    altText: "Motion animation project preview",
    title: "Motion reel entry",
    detail: "Learner packages a product animation with critique notes.",
  },
]

const SchoolLogos = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-center font-bold uppercase text-[#00A9C1]">
          Learner outcomes
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold text-center text-gray-900 mt-3 mb-5">
          Proof beats promises.
        </h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto text-lg mb-10">
          Outcome claims on Horace are tied to reviewed projects, checkpoint
          logs, portfolio entries, or mentor testimonials.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {proofs.map((proof, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded overflow-hidden bg-white"
            >
              <Image
                src={proof.imageUrl}
                alt={proof.altText}
                className="h-40 w-full object-cover"
                width={420}
                height={240}
              />
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900">
                  {proof.title}
                </h3>
                <p className="text-gray-600 mt-2">{proof.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SchoolLogos
