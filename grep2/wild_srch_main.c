#include <sys/types.h>
#include <sys/stat.h>
#include <sys/wait.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <stdarg.h>
#include <stdio.h>
#include <dirent.h>
#include <errno.h>
#include <signal.h>
#include "main.h"

#define ex (execve("/bin/ls", args, NULL) == (-1))
#define ps(x) (printf("%s\n", (x)))
#define pd(x) (printf("%d\n", (x)))
#define plu(x) (printf("%lu\n", (x)))

void handle_realloc3(char **buff, size_t *old_bsize, size_t *bsize);
char *strtok4(char *str, const char *delim, int *line_no);
char **wild_srch2(char *str, char *sub_str);



/**
 * main - searches for a pattern in specified file(s).
 * @ac: number of arguments to main.
 * @argv: array of strings of main arguments.
 *
 * Note: capable of wild searches with '*' char.
 * Return: 0 always.
 */
int main(int ac, char **argv)
{
	mallocd_t mallocd;
	int i, j, rd = 1, tot_rd = 0, line_no = 0, fdrd;
	char *buff, *token, **buff2;
	size_t bsize = (sizeof(char) * BUFSIZE), bsize_tot = bsize, old_bsize = 0;

	mallocd_adds(&mallocd, NULL);
	if (ac <= 2)
	{
		printf("Usage: grep2 search_pattern filename(s)\n");
		return (0);
	}

	for (i = 2; i < ac; i++) /* read from each file to buff and process contents */
	{
		fdrd = open(argv[i], O_RDONLY); /* open file for reading */
		if (fdrd == -1)
		{
			perror("open");
			continue;
		}

		buff = malloc(bsize); /* allocate buffer memory */
		if (!buff)
		{
			perror("malloc");
			close(fdrd);
			continue;
		}
		_memset(buff, 0, bsize); /* initialize the buffer */
		mallocd_adds(NULL, "c", buff);

		for (j = 0; rd; j++) /* read into the buffer */
		{
			rd = read(fdrd, buff + tot_rd, BUFSIZE);
			tot_rd += rd;
			if (rd == -1)
			{
				perror("read");
				continue;
			}

			if (rd >= BUFSIZE)
			{
				handle_realloc3(&buff, &old_bsize, &bsize_tot);
			}
			else if (rd >= 0 && rd < BUFSIZE)
			{
				break; /* EOF */
			}
		}
		close(fdrd);

		/* process the contents of buff */
		token = strtok4(buff, "\n", &line_no);
		if (!token)
		{
			continue;
		}
		for (j = 0; token; j++)
		{
			if (wild_srch(token, argv[1]))
			{
				buff2 = wild_srch2(token, argv[1]);
				/* printf("\033[0;35m%s:\033[0;33m%d\t%s\033[0m\n", argv[i], line_no, token); */
				printf("\033[0;35m%s\033[0m:\033[0;33m%d\033[0m:\t%s\033[1;31m%s\033[0m%s\n",
						argv[i], line_no, buff2[0], buff2[1], buff2[2]);
			}
			free_mallocd("c", buff);

			token = strtok4(NULL, "\n", &line_no);
		}

		/* reset variables before next file */
		tot_rd = 0;
		bsize_tot = bsize;
		old_bsize = 0;
		line_no = 0;

		free_mallocd(NULL);
	}

	return (0);
}



/**
 * handle_realloc3 - handles reallocation of memory to buff.
 * @buff: address of a single pointer previously allocated memory.
 * @old_bsize: the address of the variable holding buff's previous size.
 * @bsize: address of the variable representing the total size of buff.
 *
 * Description: this subroutine is useful when you want to
 * perform updating of buffer size variables and reallocation as a unit.
 */
void handle_realloc3(char **buff, size_t *old_bsize, size_t *bsize)
{
	*old_bsize = *bsize;
	*bsize += BUFSIZE;

	*buff = _realloc(*buff, *old_bsize, *bsize);
	if (!(*buff))
	{
		perror("handle_realloc3");
	}
	mallocd_adds(NULL, "c", *buff);
}



/**
 * strtok4 - tokenize a string, str, based on delimiters, delim.
 * @str: the string to tokenize.
 * @delim: delimiter characters.
 * @line_no: address of an int to record
 * the line the newline delimiter was found.
 *
 * Description: this version is derived from strtok2().
 * It keeps track of how many newline
 * xters are seen and updates line_no with the value.
 * Return: the address of the current extracted token, or NULL.
 */
char *strtok4(char *str, const char *delim, int *line_no)
{
	char *char1;
	static char *ptc;
	int i, j, quote = 0, n = 0, flag = 1;

	(void)line_no;
	if (str != NULL)
		ptc = str;
	if (*ptc == '\0')
		return (NULL);
	if (delim == NULL)
		return (ptc);
	for (i = 0; 1; i++)
	{
		for (j = 0; delim[j]; j++)
		{
			if (*ptc == delim[j])
			{
				*line_no = *line_no + 1;
				if (n)
				{
					*ptc = 0;
					ptc++; /* Point to next character for the next call */
					return (char1);
				}
				flag = 0;
			}
		}
		if (flag && *ptc)
		{
			if (++n == 1)
				char1 = ptc;
			if ((*ptc == '\'' || *ptc == '\"') && quote)
				find_quote(&ptc, &n); /* prevent application of tokenizaton to quotes */
		}
		flag = 1;
		if ((*ptc == '\0') && n) /*A non-delim char was seen by string end, else...*/
			return (char1);
		else if ((*ptc == '\0') && !n) /*none was seen for this call by string end*/
			return (NULL);
		ptc++;
	}
	return (NULL);
}

/* ====================NOTES=================== */

/* L31: n is greater than 0 only if a */
/* non-delimiter character has been encountered. */
/* This makes it possible to ignore any */
/* leading delim xter and prevent a false termination. */

/* L37: flag is set to 0 only when a delim xter is met, */
/* to prevent entrance into the IF block on L41, which is */
/* only meant for when the current value of ptc is a non-delim xter. */



/**
 * find_quote - search for single-, or double-quoted strings.
 * @ptc: the address of a char pointer from the calling function.
 * @n: address of an int from calling function that keeps
 * track of the number of non-delimiter characters seen in this call.
 *
 * Descrption: This fuction is only called if a single or double
 * quote character is seen in strtok2, the calling function this is
 * a helper to. ptc represents the address of the
 * static ptc in strtok2, and will be updated if a
 * second quote character is seen to prevent tokenizing quoted strings.
 */
void find_quote(char **ptc, int *n)
{
	int i;
	char c = **ptc;

	switch (c)
	{
		case '\'':
			for (i = 1; (*ptc)[i]; i++)
			{
				if ((*ptc)[i] == '\'')
				{
					(*ptc) = (*ptc) + i;
					*n = *n + i;
					return;
				}
			}
			break;
		case '\"':
			for (i = 1; (*ptc)[i]; i++)
			{
				if ((*ptc)[i] == '\"')
				{
					(*ptc) = (*ptc) + i;
					*n = *n + i;
					return;
				}
			}
	}
}


/**
 * wild_srch2 - searches for sub_str in str. Derived from verson1.
 * @str: string to search in.
 * @sub_str: string to search for.
 *
 * Note: this function handles wild search, so sub_str can
 * contain the wild chararcter '*'. A wild search will not
 * be implemented if there's a match of "*" in both strings, but a literal search.
 * Return: an array of strings on search success. The first
 * string being the first part of the token, str;
 * the second being the matched string; and the
 * third being the rest of str. NULL is returned on failure.
 */
char **wild_srch2(char *str, char *sub_str)
{
	int i, j, last_idx;
	char  *str_cpy, *str_cpy2, *str_cpy3, *sub_str_cpy, *char1, *char2, **buff;

	buff = malloc(sizeof(char *) * 4);
	if (!buff)
	{
		perror("wild_srch: malloc");
		return (NULL);
	}
	for (j = 0; j < 4; j++)
	{
		buff[j] = NULL; /* initialize buff */
	}
	mallocd_adds(NULL, "p", buff);

	/* make a copy of str so as to prevent the situation
	where the search could continue into other strings when
	str is tokenized from a longer string, the search is at
	str's end and sub_str is not yet exhausted. The search
	will move past the null byte of str and into the longer
	string when i is incremented aroung line 112. */
	str_cpy = strdup2(str); /* to free */
	str_cpy2 = strdup2(str);
	str_cpy3 = strdup2(str);
	if (!sub_str || sub_str[0] == 0) /* nothing to search for */
	{
		return (NULL);
	}
	sub_str_cpy = sub_str; /* backup for reseting sub_str */

	i = 0;
	if (*sub_str == '*' && str_cpy[0] != '*')
	{
		sub_str++; /* skip wild char */
	}
	while (str_cpy[i])
	{
		if (str_cpy[i] == *sub_str)
		{
			char1 = str_cpy + i; /* for first part of token */
			char2 = str_cpy2 + i; /* possible first char of match to be tokenized */
			last_idx = i; /* save the entry index in str for when search fails */
			for (; str_cpy[i]; i++)
			{
				if (*sub_str == 0) /* to be checked anytime a char is skipped, or pointer moved */
				{
					str_cpy2[i] = 0; /* terminator for char2 string  */
					*(char1) = 0; /* terminator for first part of token */
					buff[0] = str_cpy; /* first part of token terminating at match */
					buff[1] = char2; /* second part consisting of search match/char2 string */
					buff[2] = str_cpy3 + i; /* third part consisting of rest of token */
					return (buff);
				}

				if (*sub_str == '*' && str_cpy[i] != '*') /* implement wild search */
				{
					sub_str++; /* skip */
					if (*sub_str == 0)
					{
						str_cpy2[i] = 0; /* terminator for char2 string  */
						*(char1) = 0; /* terminator for first part of token */
						buff[0] = str_cpy; /* first part of token terminating at match */
						buff[1] = char2; /* second part consisting of search match/char2 string */
						buff[2] = str_cpy3 + i; /* third part consisting of rest of token */
						return (buff);
					}
					/* move along str till current char at sub_str is seen */
					for (; str_cpy[i]; i++)
					{
						if (str_cpy[i] == *sub_str)
						{
							break; /* match found; continue with search */
						}
					}
					if (str_cpy[i] == 0) /* end of str reached; search failure */
					{
						return (NULL);
					}
					/* if execution gets here then i would be pointing to the current match in str */
				}

				if (*sub_str == str_cpy[i])
				{
					sub_str++; /* if str[i+1] is null, will be checked outside loop for null */
					continue;
				}
				else
				{
					i = last_idx; /* reset i to value before initial match */
					sub_str = sub_str_cpy; /* reset sub_str */
					break;
				}
			}
		}
		if ((*sub_str == 0 || *sub_str == '*') && (str_cpy[i] == 0)) /* FOR loop exited without checking it bcos str is ended*/
		{
			if (*sub_str == 0 || *(sub_str + 1) == 0)
			{
				str_cpy2[i] = 0; /* terminator for char2 string  */
				*(char1) = 0; /* terminator for first part of token */
				buff[0] = str_cpy; /* first part of token terminating at match */
				buff[1] = char2; /* second part consisting of search match/char2 string */
				buff[2] = str_cpy3 + i; /* third part consisting of rest of token */
				return (buff);
			}
		}
		if (str_cpy[i] == 0)
		{
			break; /* prevent invalid read at L53 on i++ */
		}

		i++;
	}

	return (NULL);
}
