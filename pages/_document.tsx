import { Html, Head, Main, NextScript } from 'next/document';
const gid = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;
const gt = process.env.NEXT_PUBLIC_GTM;
export default function Document() {
  const title = 'Horace Learning: The Best Global Education Network';
  const description =
    'In Horace Learning, we build the best global education network, fostering innovation in programming education, offering high-quality online courses,skills, and creating a collaborative community for tech and coding excellence. Founded by Femi Adigun';
  const keywords =
    'Horace Learning, Tech Skills, Programming Ed, Online Learning, Tech Ed, EdTech Platform, Best Coding Courses, Software Dev Training, Web Dev Courses, Learn Code, Femi Adigun';
  const url = 'https://horacelearning.com';
  const imageUrl = 'https://horacelearning.com/img/logo.webp';

  const jsonLdData = {
    '@context': 'https://schema.org/',
    '@type': 'Horace Learning',
    name: 'Femi Adigun',
    company: 'ESSL',
    url: url,
    logo: imageUrl,
  };

  return (
    <Html>
      <Head>
        <title>{title}</title>
        <meta name="keywords" content={keywords} />
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i|Playfair+Display:400,400i,700,700i,900,900i"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Mulish:100,100i,300,300i,400,400i,700,700i,900,900i|Playfair+Display:400,400i,700,700i,900,900i"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${gid}`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', ${gt}, {
                  page_path: window.location.pathname,
                });
              `,
          }}
        />
        <script type="application/ld+json">{JSON.stringify(jsonLdData)}</script>

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
