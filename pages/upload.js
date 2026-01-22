export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/upload.html',
      permanent: false,
    },
  };
}

export default function Upload() {
  return null;
}
