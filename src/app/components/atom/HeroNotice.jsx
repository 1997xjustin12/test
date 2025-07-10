function HeroNotice({ data }) {
  return (
    <>
      {data?.banner?.notice_visible && data?.banner?.notice_html && (
        <div className="w-full" 
            dangerouslySetInnerHTML={{ __html: data?.banner?.notice_html }}
        />
      )}
    </>
  );
}

export default HeroNotice;
