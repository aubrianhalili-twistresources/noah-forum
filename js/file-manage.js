
var FileManage = (function() {
  return {
    init: function() {
      
      
      
      
      $('.file-list').click(function() {
        
        
        
        
        
        
        FileManage.listFiles(function() {
          FileManage.initFileUpload();

          jQuery('.view .btn').on('click', function () {
            jQuery(this).parent().find('.btn').removeClass('active');
            jQuery(this).addClass('active');

            if (jQuery(this).hasClass('grid')) {
              jQuery('.files').addClass('grid');
            } else {
              jQuery('.files').removeClass('grid');
            }
          });
        });
      });

      
      
      
      
      
      var source = $('#noah-curia-template-fileList-fullpage').html();
      Handlebars.precompile(source);
      
      
      
      // resize box on page Load and Window resize
      FileManage.box('.files.grid .media .pads');
      $('.file-list').trigger('click');
      
    },
    
    listFiles: function(callback) {
      var template = Handlebars.compile($('#noah-curia-template-fileList-fullpage').html());
      $.ajax({
        method: 'GET',
        url: 'http://localhost:4000/api/noah/thread/157293',
        dataType: 'json',
        success: function(data, status, xhr) {
          var list = data.thread.children;
          list = _.filter(list, function (elem) {
            return !(_.isNull(elem.filename));
          });

          var html = template({file: list});
          $('#curia-posts').html(html);
          callback();
        },
        error: function(xhr, status, error) {
          console.log(error);
        }
      });
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
        $('.file-list').trigger('click');
      });
    },
    
    box : function (selector) {
      
      jQuery(window).on('load resize click', function() {
        
        FileManage.boxReset('.files.grid .media .pads');
        jQuery(selector).height( FileManage.getMaxH(jQuery(selector)) );
        
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