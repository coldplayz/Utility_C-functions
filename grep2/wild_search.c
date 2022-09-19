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

/**
 * wild_srch - searches for sub_str in str.
 * @str: string to search in.
 * @sub_str: string to search for.
 *
 * Note: this function handles wild search, so sub_str can
 * contain the wild chararcter '*'. A wild search will not
 * be implemented if there's a match of "*" in both strings, but a literal search.
 * Return: 1 on search success; 0 on failure.
 */
int wild_srch(char *str, char *sub_str)
{
	int i, last_idx;
	char  *str_cpy, *sub_str_cpy;

	/* make a copy of str so as to prevent the situation
	where the search could continue into other strings when
	str is tokenized from a longer string, the search is at
	str's end and sub_str is not yet exhausted. The search
	will move past the null byte of str and into the longer
	string when i is incremented aroung line 112. */
	str_cpy = strdup2(str); /* to free */
	if (!sub_str || sub_str[0] == 0) /* nothing to search for */
	{
		return (1);
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
			last_idx = i; /* save the entry index in str for when search fails */
			for (; str_cpy[i]; i++)
			{
				if (*sub_str == 0) /* to be checked anytime a char is skipped, or pointer moved */
				{
					return (1);
				}

				if (*sub_str == '*' && str_cpy[i] != '*') /* implement wild search */
				{
					sub_str++; /* skip */
					if (*sub_str == 0)
					{
						return (1);
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
						return (0);
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
				return (1);
			}
		}
		if (str_cpy[i] == 0)
		{
			break; /* prevent invalid read at L53 on i++ */
		}

		i++;
	}

	return (0);
}
