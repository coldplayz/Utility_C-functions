#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include "main.h"


/**
 * strtok2 - tokenize a string, str, based on delimiters, delim.
 * @str: the string to tokenize.
 * @delim: delimiter characters.
 * @quote: an int determining whether to apply
 * tokenization to quoted stings (non-zero), or not (0).
 *
 * Description: works similar to the library's version. See strtok(3).
 * Note: modifies the characters in str. So, not safe.
 * Return: the address of the current extracted token, or NULL.
 */
char *strtok2(char *str, const char *delim, int quote)
{
	char *char1;
	static char *ptc;
	int i, j, n = 0, flag = 1;

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
				if (n)
				{
					*ptc = 0;
					ptc++; /* Point to next character for the next call */
					return (char1);
				}
				flag = 0;
			}
		}
		if (flag)
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
