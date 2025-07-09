function HeroNotice({ data }) {
  return (
    <>
      {data?.banner?.notice_visible && data?.banner?.notice_html && (
        <div className="bg-neutral-700 text-white">
          <div
            className="container mx-auto flex items-center justify-center p-1 flex-col"
            dangerouslySetInnerHTML={{ __html: data?.banner?.notice_html }}
          />
        </div>
      )}
    </>
  );
}

export default HeroNotice;
