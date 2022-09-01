#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <stdarg.h>
#include <stdio.h>
#include "main.h"


#define ps(x) printf("%s\n", x)
#define pd(x) printf("%d\n", x)
#define plu(x) printf("%lu\n", x)


/**
 * str_arrlen - calculates the size of a NULL-terminated array of strings.
 * @arr: the pointer to array of strings.
 *
 * Return: the array length.
 */
int str_arrlen(char **arr)
{
	int len = 0, i;

	for (i = 0; arr[i]; i++)
	{
		len++;
	}

	return (len);
}
