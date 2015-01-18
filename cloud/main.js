require("cloud/app.js");
// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:
AV.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

AV.Cloud.define("mayBeLike", function(request, response) {
  console.log("Tag: " + request.params.Tag);
  console.log("Token: " + request.params.token);
  var query = new AV.Query("series");
  query.equalTo(request.params.Tag, 1);
  query.descending("createdAt");
  query.limit(10);

  query.find({
    success: function(results) {
      response.success(results);
    },
    error: function() {
      response.error("movie lookup failed");
    }
  });
});
