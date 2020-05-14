function base10_64(num) {
  var nnum = Number(num);
  var order =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
  var base = order.length;
  var rtn = "",
      r;
  while (nnum) {
      r = nnum % base;
      nnum -= r;
      nnum /= base;
      rtn = order.charAt(r) + rtn;
  }
  return rtn;
}

function base16_10(num) {
  return parseInt(num, 16);
}

function URL2AID(url) {
  console.log(url);

  var urlPieces = url.split("/").filter(x => x);
  if (urlPieces.length !== 5 || urlPieces[1] !== 'www.ptt.cc') return "";

  var board = urlPieces[3];

  var codes = urlPieces[4].split(".");
  if(codes.length !== 5) return "";
  
  var code10 = codes[1];
  var code16 = codes[3];
  var b10_64 = base10_64(code10);
  var b16_64 = base10_64(base16_10(code16));
  if(b16_64.length === 1) b16_64 = "0"+b16_64;

  return [board, b10_64 +b16_64];
}



export {URL2AID};
