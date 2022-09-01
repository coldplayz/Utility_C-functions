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
#define BUFSIZE 16


int main(void)
{
	int fdrd, i, n;
	char *buff1, *buff2, **sarr;
	int bsize = BUFSIZE, old_bsize = 0;

	fdrd = open("text", O_RDONLY);
	if (fdrd == -1)
	{
		perror("fdrd-open");
		return (1);
	}

	buff1 = malloc(BUFSIZE);

	for (i = 0; 1; i++)
	{
		n = read(fdrd, (buff1 + old_bsize), BUFSIZE);
		if (n == -1)
		{
			perror("fdrd-read");
			return (1);
		}

		if (n >= BUFSIZE)
		{
			old_bsize = bsize;
			bsize += BUFSIZE;
			buff1 = realloc(buff1, bsize);
			if (!buff1)
			{
				perror("buff1-realloc");
				return (1);
			}
		}

		if (n < BUFSIZE)
		{
			break;
		}
	}
	buff1[old_bsize + n] = 0;

	ps(buff1);
	free(buff1);
	close(fdrd);

	return (1);
}
