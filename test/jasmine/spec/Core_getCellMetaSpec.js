describe('Core_getCellMeta', function () {
  var id = 'testContainer';

  beforeEach(function () {
    this.$container = $('<div id="' + id + '"></div>').appendTo('body');
  });

  afterEach(function () {
    if (this.$container) {
      destroy();
      this.$container.remove();
    }
  });

  it('should not allow manual editing of a read only cell', function () {
    var allCellsReadOnly = false;

    handsontable({
      cells: function () {
        return {readOnly: allCellsReadOnly}
      }
    });
    allCellsReadOnly = true;
    selectCell(2, 2);

    keyDown('enter');

    expect(isEditorVisible()).toEqual(false);
  });

  it('should allow manual editing of cell that is no longer read only', function () {
    var allCellsReadOnly = true;

    handsontable({
      cells: function () {
        return {readOnly: allCellsReadOnly}
      }
    });
    allCellsReadOnly = false;
    selectCell(2, 2);

    keyDown('enter');

    expect(isEditorVisible()).toEqual(true);
  });

  it('should use default cell editor for a cell that has declared only cell renderer', function () {
    handsontable({
      cells: function () {
        return {
          type: {
            renderer: function (instance, td, row, col, prop, value, cellProperties) {
              //taken from demo/renderers.html
              Handsontable.TextCell.renderer.apply(this, arguments);
              $(td).css({
                background: 'yellow'
              });
            }
          }
        }
      }
    });
    selectCell(2, 2);

    keyDown('enter');
    document.activeElement.value = 'new value';
    destroyEditor();
    expect(getDataAtCell(2, 2)).toEqual('new value');
  });

  it('should allow to use type and renderer in `flat` notation', function () {
    handsontable({
      data : [[1,2,3,4],[5,6,7,8],[0,9,8,7]],
      cells: function (row, col) {
        if (row === 2 && col === 2) {
          return {
            type: 'checkbox',
            renderer: function (instance, td, row, col, prop, value, cellProperties) {
                //taken from demo/renderers.html
                Handsontable.TextCell.renderer.apply(this, arguments);

                td.style.background = 'yellow';
            }
          }
        }
      }
    });

    expect(getCell(2, 2).style.background).toEqual('yellow');
    expect(getCell(1, 1).style.background).toEqual('');
  });

});