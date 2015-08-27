var createThumb = function(fileObj, readStream, writeStream) {
  // Transform the image into a 10x10px thumbnail
  gm(readStream, fileObj.name()).resize('320', '240').stream().pipe(writeStream);
};

FS.debug = true;
FS.HTTP.setBaseUrl('/media');

Images = new FS.Collection("images", {
  stores: [
    new FS.Store.S3("thumbs", {
      //region: "my-s3-region", //optional in most cases
      accessKeyId: "AKIAIKV5O2EXQOKFW4VA", //required if environment variables are not set
      secretAccessKey: "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", //required if environment variables are not set
      bucket: "pe-net-images", //required
      ACL: "public-read", //optional, default is 'private', but you can allow public or secure access routed through your app URL
      //folder: "thumbs", //optional, which folder (key prefix) in the bucket to use 
      // The rest are generic store options supported by all storage adapters
      transformWrite: createThumb, //optional
      //transformRead: myTransformReadFunction, //optional
      maxTries: 2 //optional, default 5
    }),
    new FS.Store.S3("images", {
      //region: "my-s3-region", //optional in most cases
      accessKeyId: "AKIAIKV5O2EXQOKFW4VA", //required if environment variables are not set
      secretAccessKey: "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", //required if environment variables are not set
      bucket: "pe-net-images", //required
      ACL: "public-read", //optional, default is 'private', but you can allow public or secure access routed through your app URL
      //folder: "full", //optional, which folder (key prefix) in the bucket to use 
      // The rest are generic store options supported by all storage adapters
      transformWrite: createThumb, //optional
      //transformRead: myTransformReadFunction, //optional
      maxTries: 2 //optional, default 5
    }),
  ],
  filter: {
    allow: {
      contentTypes: ['image/*'] //allow only images in this FS.Collection
    }
  }
});

Images.allow({
    download: function(userId, fileObj) {
      return true
    },
    insert: function () {
      return true;
    },
    update: function () {
      return true;
    },
    remove: function () {
      return true;
    }
});