module.exports = {
  async redirects() {
    return [
      {
        source: "/users/[username]",
        destination: "/users/[username]/maps",
        permanent: true,
      },
    ];
  },
};
