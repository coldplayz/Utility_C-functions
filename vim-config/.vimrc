let mapleader = ','
nnoremap Y y$

set backspace=indent,eol,start
set mouse=a
set smartindent
set tabstop=2
set expandtab
set shiftwidth=2
set ruler

call plug#begin()

" List your plugins here
" Plug 'tpope/vim-sensible'

" Use release branch (recommended)
Plug 'neoclide/coc.nvim', {'branch': 'release'}

" Markdown preview (If you have nodejs)
Plug 'iamcco/markdown-preview.nvim', { 'do': 'cd app && npx --yes yarn install' }

call plug#end()

autocmd FileType json syntax match Comment +\/\/.\+$+

" We bind explorer to <leader>e here, feel free to change this
nmap <leader>e :CocCommand explorer<CR>
