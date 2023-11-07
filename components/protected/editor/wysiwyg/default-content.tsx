export const defaultEditorContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Introducing Your Product - WPay" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: " This is an full-stack payment & store app. Built with Circle Api and Supabase",
        },
      ],
    },

    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Features" }],
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Web3 Login and Payment." }],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Easy Operation and Management of Products.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "image",
      attrs: {
        src: "https://iskzuogcmkzumadqjnbv.supabase.co/storage/v1/object/public/posts/banner/banners.png",
        alt: "banners.png",
        title: "banners.png",
        width: null,
        height: null,
      },
    },
  ],
};
