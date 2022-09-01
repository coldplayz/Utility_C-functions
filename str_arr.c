#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include "main.h"

#define ps(x) printf("%s\n", x)
#define pd(x) printf("%d\n", x)

/**
 * str_arr - collects token strings into an array of strings.
 * @str: string to tokenize.
 * @delim: string made up of delimiter characters.
 *
 * Return: a NULL-teminated array of token strings.
 */
char **str_arr(char *str, const char *delim)
{
	char **str_ar, *token;
	int i, bsize = sizeof(char *), bsize_total = bsize;

	str_ar = malloc(bsize);
	if (!str_ar)
	{
		printf("Malloc error\n");
		exit(98);
	}

	token = strtok(str, delim);
	if (!token)
	{
		str_ar[0] = NULL;
		return (str_ar);
	}
	i = 0;
	while (token)
	{
		str_ar[i] = token;
		i++;
		token = strtok(NULL, delim);

		handle_realloc(&(str_ar), i, bsize, &bsize_total);

		if (!token)
		{
			str_ar[i] = NULL;
			break;
		}
	}

	return (str_ar);
}


/**
 * handle_realloc - handles reallocation of memory to str_ar.
 * @i: the value of the index tracking the number of elements in str_ar.
 * @str_ar: address of a double pointer previously allocated memory.
 * @bsize: the unit memory size for str_ar.
 * @bsize_total: address of the variable
 * representing the total size of the str_ar buffer.
 */
void handle_realloc(char ***str_ar, int i, int bsize, int *bsize_total)
{
	char **tmp;

	if (i >= (*bsize_total / bsize))
	{
		*bsize_total += bsize;
		tmp = realloc(*str_ar, *bsize_total);
		if (!tmp)
		{
			printf("Realloc error\n");
			exit(99);
		}

		*str_ar = tmp;
	}
}
