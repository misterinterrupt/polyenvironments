Images = new FS.Collection("images", {
  stores: [
    new FS.Store.S3("thumbs"),
    new FS.Store.S3("images"),
  ],
  filter: {
    allow: {
      contentTypes: ['image/*'] //allow only images in this FS.Collection
    }
  }
});
