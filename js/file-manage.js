
var FileManage = (function() {
  return {
    init: function() {
      $('.file-list').click(function() {
        Curia.loadTemplate('#noah-curia-template-fileList-fullpage', function(err, template) {
          if (err) {
            console.log(error);
          } else {
            $('#curia-posts').html(template);
            jQuery('.view .btn').on('click', function () {
              jQuery(this).parent().find('.btn').removeClass('active');
              jQuery(this).addClass('active');

              if (jQuery(this).hasClass('grid')) {
                jQuery('.files').addClass('grid');
              } else {
                jQuery('.files').removeClass('grid');
              }
            });
            
            FileManage.initFileUpload();
            FileManage.listFiles();
          }
        });
      });
      
      // resize box on page Load and Window resize
      FileManage.box('.files.grid .media .pads');
    },
    
    listFiles: function(callback) {
      Curia.loadTemplate('#noah-curia-template-fileList', function(err, template) {
        if (err) {
          console.log(error);
        } else {
          $.ajax({
            method: 'GET',
            url: 'http://localhost:4000/api/noah/thread/157293',
            dataType: 'json',
            success: function(data, status, xhr) {
              var list = data.thread.children;
              FileManage.filterFile(list, function(list) {
                var html = Mustache.to_html(template, {file: list});
                $('.files').html(html);
                if (callback) {
                  callback();
                }
              });
            },
            error: function(xhr, status, error) {
              console.log(error);
            }
          });
        }
      });
    },
    
    filterFile: function(list, callback, searchKey) {
      list = _.filter(list, function (elem) {
        var isValid = false;
        if (elem.filename && elem.filesize) {
          isValid = true;
        }
        return isValid;
      });
      
      if (searchKey) {
        searchKey = searchKey.toLowerCase();
        list = _.filter(list, function (elem) {
          var filename = elem.filename.toLowerCase();
          var index = filename.indexOf(searchKey);
        
          return (index >= 0);
        });
      }
      callback(list);
    },
    
    startFileUpdate: function(callback) {
      myDropzone.options.params = {
        type: 'file',
        rootId: 157293,
        parentId: 157293,
        description: 'File Description'
      };
      myDropzone.processQueue();
    },
    
    initFileUpload: function() {
      myDropzone = new Dropzone('div#file-upload', {
        url: 'http://localhost:4000/api/noah/element',
        paramName: 'attachment',
        acceptedFiles: '',
        autoProcessQueue: false,
        addRemoveLinks: 'sample remove link',
        sending: function (a, b, c, d, e) {
          var i = 0;
        },
        error: function (file, msg, request) {
          console.log(msg);
        }
      });
      
      $('#myModal').on('hidden.bs.modal', function (e) {
        myDropzone.removeAllFiles(true);
        FileManage.listFiles();
      });
    },
    
    box : function (selector) {
      jQuery(window).on('load resize click', function() {
        FileManage.boxReset('.files.grid .media .pads');
        jQuery(selector).height( FileManage.getMaxH(jQuery(selector)));
      });
    },
    
    boxReset : function (selector) {
      jQuery(selector).height('');
    },
    
    getMaxH : function (selector) {
      var h = new Array();
      selector.each(function(index, value) {
        h[index] = jQuery(this).height();
      });
      return Math.max.apply(Math, h);
    }
  };
}());

jQuery(FileManage.init);