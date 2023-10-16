#!/usr/bin/env python3
import re
import sys

input_filename = sys.argv[1]
output_filename = sys.argv[2]
content_objs = []

def add_indentation(line, level):
    ''' Add appropriate indentation to HTML line. '''
    indentation = '\t' * level
    return f'{indentation}{line}'


class HTMLIndentor:
    ''' Used for actual nodes. '''

    def __init__(self, content_lines=[], parent_obj=None, parent_level=-1):
        if parent_level:
            # for DOCTYPE and html tags
            self.node_level = parent_level + 1
            self.parent_level = parent_level
        else:
            self.node_level = parent_obj.node_level + 1
            self.parent_obj = parent_obj

        self.opening_tag = ''
        self.closing_tag = ''
        self.content_objs = []

    def parse_content_lines(self, content_lines=[], parent_obj=None, parent_level=None):
        ''' ...where the magic happens.
        '''
        # content_lines_copy = content_lines.copy()
        opening_regex = r'<(.*?)>'

        while content_lines:
            line = content_lines[0]
            match_obj = re.match(opening_regex, line)
            content_lines.pop(0)
            # counter += 1

            if match_obj:
                # opening tag found
                tag_name = match_obj.groups()[0].strip().split()[0]
                # see if the element has content
                closing_regex = f'</{tag_name}>'
                closing_tag_match = None
                new_content_lines = []
                ignore_closing = 0
                while not closing_tag_match and content_lines:
                    # closing tag not found and list not empty
                    line2 = content_lines[0]
                    # if opening tag of element, whose closing
                    # ...tag is being searched for, appears
                    # ... again b4 closing tag found, then
                    # ... these other, similar tags should be
                    # ... ignored (along with their closing)
                    match_obj = re.match(f'<{tag_name}.*>', line2)
                    if match_obj:
                        # similar, child tag found; to ignore
                        ignore_closing += 1

                    match_obj = re.match(closing_regex, line2)
                    content_lines.pop(0)

                    if match_obj:
                        if ignore_closing > 0:
                            # match found for similar child
                            ignore_closing -= 1
                        else:
                            # match found for original/parent
                            closing_tag_match = True
                            break

                    # not the closing tag; possible content
                    new_content_lines.append(line2)

                if closing_tag_match:
                    # closing tag found
                    obj = HTMLIndentor(
                            parent_obj=parent_obj,
                            parent_level=parent_level,
                            )
                    obj.opening_tag = add_indentation(line, obj.node_level)
                    obj.closing_tag = add_indentation(line2, obj.node_level)
                    if parent_obj:
                        # element not DOCTYPE or html
                        parent_obj.content_objs.append(obj)
                    content_objs.append(obj)
                    # recurse with children
                    self.parse_content_lines(new_content_lines, parent_obj=obj)
                else:
                    # not found; likely an empty element
                    # reset content lines to exclude `line`
                    content_lines = new_content_lines
                    obj = HTMLIndentor(
                            parent_obj=parent_obj,
                            parent_level=parent_level,
                            )
                    obj.opening_tag = add_indentation(line, obj.node_level)
                    if parent_obj:
                        # element not DOCTYPE or html
                        parent_obj.content_objs.append(obj)
                    content_objs.append(obj)

                continue

            # not an HTML element; still append to tree
            obj = HTMLIndentor(
                    parent_obj=parent_obj,
                    parent_level=parent_level,
                    )
            obj.opening_tag = add_indentation(line, obj.node_level)
            if parent_obj:
                # element not DOCTYPE or html
                parent_obj.content_objs.append(obj)
            content_objs.append(obj)

    def get_node_string(self):
        ''' Get string representation for this node and descendant nodes. '''
        content_string = ''

        for content_obj in self.content_objs:
            content_string = f'{content_string}{content_obj.get_node_string()}'

        node_string = f'{self.opening_tag}{content_string}{self.closing_tag}'
        return node_string


def indent_html(content_lines):
    indentor = HTMLIndentor()

    # populate global `content_objs` list
    indentor.parse_content_lines(content_lines=content_lines, parent_level=-1)
    # get parsed document string, using just first two objects
    # ...of `content_objs`;
    # first is DOCTYPE, second is html, whose get method
    # triggers recursion to retrieve all strings down the tree
    document_string = f'{content_objs[0].get_node_string()}{content_objs[1].get_node_string()}'

    # print('#####', document_string) # SCAFF

    return document_string


def implement_indent():
    # read from file
    with open(input_filename, 'r') as input_fo:
        content_lines = input_fo.readlines()

    # parse and indent content
    indented_content = indent_html(content_lines)

    # write to file
    with open(output_filename, 'w') as output_fo:
        output_fo.write(indented_content)


# test case
lines = ['<!DOCTYPE html>\n', '<html>\n', '<head>\n', '<title>\n', 'Homepage\n', '</title>\n', '<meta charset="utf-8">\n', '<link rel="stylesheet.css" href="styles/style.css">\n', '</head>\n', '<body>\n', '</body>\n', '</html>\n']

implement_indent()
