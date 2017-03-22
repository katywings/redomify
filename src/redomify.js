import { createFilter } from 'rollup-pluginutils';
import parse5 from 'parse5';
import _ from 'lodash'

var compileNodes = function(indent, nodes, separator, idx) {
  if (idx === undefined) {
    idx = -1
  }

  indent += '  '

  var result = {
    render: '',
    update: '',
    idx: idx
  }

  if (nodes.length < 2) {
    separator = ''
  }

  _.each(nodes, (v, k) => {
    result.idx++
    var ignore = false
    var nodeListing = `this.view[${result.idx}] = `
    var nodeRender = ''
    var nodeUpdate = ''
    var attrsRender = ''
    _.each(v.attrs, (attr) => {
      attr.value = _.trim(attr.value)
      if (_.startsWith(attr.value, '{{')) {
        attr.value = attr.value.substring(2, (attr.value.length - 2))
        nodeUpdate += `\n    setAttr(this.view[${result.idx}], '${attr.name}', ${attr.value})`
      }
      else if (_.startsWith(attr.name, '@')) {
        nodeListing += `this.view['${attr.name.substring(1)}'] = `
      } else {
        if (!_.startsWith(attr.name, 'on')) {
          attr.value = `'${attr.value}'`
        } else {
          attr.value = '() => { ' + attr.value + ' }'
        }
        attrsRender += `\n${indent}  ${attr.name}: ${attr.value},`
      }
    })
    var value = _.trim(v.value)
    if (v.nodeName === '#text') {
      /* if (value == '') {
        ignore = true;
      } else { */
        if (_.startsWith(value, '{{')) {
          value = value.substring(2, (value.length - 2))
          nodeUpdate += `\n    this.view[${result.idx}].textContent = ${value}`
          nodeRender += `text()`
        } else {
          if (value === '') {
            result.idx--
            nodeListing = ''
          }
          nodeRender += `text(\` ${value}\`)`
        }
      // }
    } else {
      nodeRender += `el('${v.tagName}', {`
      nodeRender += attrsRender
      nodeRender += `\n${indent}}, [\n`
      var childResult = compileNodes(indent, v.childNodes, ',', result.idx)
      nodeRender += childResult.render
      result.update += childResult.update
      result.idx = childResult.idx
      nodeRender += `${indent}])`
    }
    if (ignore === false) {
      nodeRender = indent + nodeListing + nodeRender
      result.render += `${nodeRender}${separator}\n`
      result.update += `${nodeUpdate}`
    } else {
      result.idx--
    }
  });

  return result;
}

export default function redomify ( options = {} ) {
  var filter = createFilter( options.include, options.exclude );

  var regex = /^((.*?)render.?\(\).?{)[\S\s]*?return ([\S\s]*?)(;[\S\s]*?})$/gm

  return {
    transform ( code, id ) {
      if ( !filter( id ) ) return;

      code = code.replace(regex, (gm, m1, m2, m3, m4) => {
        var htmlTree = parse5.parseFragment(m3)
        var comp = compileNodes(m2, htmlTree.childNodes)

        var result = `${m1}
${m2}  this.view = {}
${comp.render}
${m2}  this.el = this.view.el
${m2}  this.update()
${m2}}
${m2}update () {${comp.update}
${m2}}`
        console.log(result)
        return result
      })

      // proceed with the transformation...
      return {
        code: code,
        map: { mappings: '' }
      };
    }
  };
}
