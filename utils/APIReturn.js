module.exports = function APIReturn(status, message, data = null, total = null) {
   let dataIsArray = Array.isArray(data) ? true : false;
   let result = {};
   result.status = status ? status : 'error'; // ok ,failed, inserted, updated, deleted
   result.message = message ? message : 'error';

   if (dataIsArray) {
      result.objects = data;
      result.count = data.length;
      result.total = total ? total : data.length;
   } else {
      result.object = data;
      result.count = data ? 1 : null;
      result.total = total ? total : null;
   }
   return result; // object
};
