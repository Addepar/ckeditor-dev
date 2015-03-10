/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: toolbar,button,stylescombo */

bender.editor = true;

bender.test(
{
	'test destroy editor with rich combo panel opened': function() {
		var bot = this.editorBot, editor = this.editor;
		bot.combo( 'Styles', function( combo ) {
			var panelEl = combo._.panel.element;
			editor.destroy();
			assert.isFalse( CKEDITOR.document.getBody().contains( panelEl ) );

			// #4552: Do that one more time.
			bender.editorBot.create( {}, function( bot ) {
				this.wait( function() {
					bot.combo( 'Styles', function( combo ) {
						var panelEl = combo._.panel.element;

						bot.editor.destroy();
						assert.isFalse( CKEDITOR.document.getBody().contains( panelEl ) );
					} );
				}, 0 );
			} );

		} );
	},

  'test destroy editor before it is fully initialized': function() {
    var name = 'test_editor',
        element,
        editor;

    this.editor.destroy();

    element = CKEDITOR.document.getById( name );

    editor = CKEDITOR.replace( element );
    assert.isMatching( editor.status, 'unloaded', 'The editor is not initialized' );
    editor.destroy();

    assert.isTrue( true, 'The editor can be destroyed before being fully initialized' );
  },

  'test destroy editor before language files are fully downloaded': function() {
    var name = 'test_editor',
        element,
        editor;

    this.editor.destroy();

    var originalLoader = CKEDITOR.scriptLoader.load;
    var stubbedLoader = sinon.stub( CKEDITOR.scriptLoader, 'load', function(scriptUrl, callback, scope, showBusy) {
      if( scriptUrl[0] === 'http://localhost:1030/apps/ckeditor/plugins/elementspath/lang/en.js' ) {
        setTimeout( function() {
          originalLoader.call( this, scriptUrl, callback, scope, showBusy );
        }, 50 );
      } else {
        originalLoader.call( this, scriptUrl, callback, scope, showBusy );
      }
    } );

    element = CKEDITOR.document.getById( name );

    editor = CKEDITOR.replace( element, {
      extraPlugins: 'elementspath'
    } );

    editor.on( 'pluginsLoaded', function() {
      assert.isFalse( true, 'This should not be called' );
    } );

    setTimeout( function() {
      assert.isMatching( editor.status, 'unloaded', 'The editor is not initialized' );
      editor.destroy();
    }, 5 );

    setTimeout( function() {
      debugger
      resume( function() {
        assert.isTrue( true, 'The editor can be destroyed before being fully initialized' );
      } );
    }, 1000 );

    wait();
  }
} );
