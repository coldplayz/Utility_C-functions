#include <sys/types.h>
#include <sys/stat.h>
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
#define plu(x) (printf("%lu", (x)))

/**
 * tr2 - replaces the newline characters in str with delim.
 * @delim: the character to replace newline characters with.
 */
void tr2(char **str, char delim)
{
	int i;

	for (i = 0; (*str)[i]; i++)
	{
		if ((*str)[i] == '\n')
		{
			(*str)[i] = delim;
		}
	}
}
